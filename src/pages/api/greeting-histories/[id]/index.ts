import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { greetingHistoryValidationSchema } from 'validationSchema/greeting-histories';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.greeting_history
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getGreetingHistoryById();
    case 'PUT':
      return updateGreetingHistoryById();
    case 'DELETE':
      return deleteGreetingHistoryById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGreetingHistoryById() {
    const data = await prisma.greeting_history.findFirst(convertQueryToPrismaUtil(req.query, 'greeting_history'));
    return res.status(200).json(data);
  }

  async function updateGreetingHistoryById() {
    await greetingHistoryValidationSchema.validate(req.body);
    const data = await prisma.greeting_history.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteGreetingHistoryById() {
    const data = await prisma.greeting_history.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
