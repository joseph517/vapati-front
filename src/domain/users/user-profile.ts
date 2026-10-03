// A non-numeric id comes back as 400, an unknown or deleted one as 404
export function isUserNotFound(status: number): boolean {
  return status === 400 || status === 404;
}
