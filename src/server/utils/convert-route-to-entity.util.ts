const mapping: Record<string, string> = {
  companies: 'company',
  'greeting-histories': 'greeting_history',
  'greeting-templates': 'greeting_template',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
