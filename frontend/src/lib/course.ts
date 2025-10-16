export function getCourseId(): string {
  return process.env.NEXT_PUBLIC_DEMO_COURSE_ID || '';
}
