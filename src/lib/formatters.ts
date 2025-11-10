const DATE_TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
});


export function formatDateTime(dateTime: Date): string {
    return DATE_TIME_FORMATTER.format(dateTime);
}