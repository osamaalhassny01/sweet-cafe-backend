"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = buildPaginationMeta;
exports.paginationSkip = paginationSkip;
function buildPaginationMeta(page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
}
function paginationSkip(page, limit) {
    return (page - 1) * limit;
}
//# sourceMappingURL=pagination.util.js.map