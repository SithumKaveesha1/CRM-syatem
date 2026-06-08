const getPagination = (page = 1, limit = 10) => {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (p - 1) * l;
  return { page: p, limit: l, offset };
};

module.exports = { getPagination };
