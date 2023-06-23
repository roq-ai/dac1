import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { greetingTemplateValidationSchema } from 'validationSchema/greeting-templates';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.greeting_template
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getGreetingTemplateById();
    case 'PUT':
      return updateGreetingTemplateById();
    case 'DELETE':
      return deleteGreetingTemplateById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGreetingTemplateById() {
    const data = await prisma.greeting_template.findFirst(convertQueryToPrismaUtil(req.query, 'greeting_template'));
    return res.status(200).json(data);
  }

  async function updateGreetingTemplateById() {
    await greetingTemplateValidationSchema.validate(req.body);
    const data = await prisma.greeting_template.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteGreetingTemplateById() {
    const data = await prisma.greeting_template.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
