const CORE_LEADERSHIP_EMAILS = new Set([
  'dheenadayalan.r.s.139@kalvium.community',
  'nayeem.sajjath.m.139@kalvium.community',
  'imran.s.139@kalvium.community',
  'nayeem.sajjath.s.139@kalvium.community',
  'mohamed.sharaf.s.139@kalvium.community',
  'imran.s.s.139@kalvium.community'
]);

export function requireCoreLeadership(req, res, next) {
  const email = (
    req.headers['x-user-email'] ||
    req.body?.requesterEmail ||
    req.body?.userEmail ||
    ''
  )
    .toString()
    .trim()
    .toLowerCase();

  if (!email || !CORE_LEADERSHIP_EMAILS.has(email)) {
    return res.status(403).json({
      success: false,
      message: 'Only core members can create mentors or students.'
    });
  }

  next();
}
