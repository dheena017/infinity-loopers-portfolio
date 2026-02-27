export function formatUTCDate(value) {
    if (!value) return '—';

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return '—';

    return parsedDate.toLocaleDateString('en-GB', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });
}
