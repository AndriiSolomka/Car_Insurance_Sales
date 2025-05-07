export const getPolicyDates = (): { issueDate: string; expiryDate: string } => {
  const today = new Date();
  const issueDate = today.toISOString().split('T')[0];

  const nextYear = new Date(today);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const expiryDate = nextYear.toISOString().split('T')[0];

  return { issueDate, expiryDate };
};
