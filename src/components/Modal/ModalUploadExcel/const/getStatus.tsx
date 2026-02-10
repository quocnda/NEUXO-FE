import { checkHadOtherWatchlist } from '@/api/company';
import { linkedinUrlRegex, twitterUrlRegex } from '@/lib/validations/validation.utility';

import { data_icp } from './const';

const isValidLinkedIn = (url: string) => {
  const linkedInPattern = linkedinUrlRegex;
  return linkedInPattern.test(url);
};

const isValidEmailFormat = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidTwitter = (url: string) => {
  const twitterInPattern = twitterUrlRegex;
  return twitterInPattern.test(url);
};

const isValidICP = (companyICP: string): boolean => {
  return data_icp.some((icp) => icp.icp_name === companyICP);
};

const getStatus = async (item: any, index: number, data: any[]): Promise<string> => {
  const isDuplicate = data.some(
    (record, i) =>
      i !== index &&
      record.company_linkedin === item.company_linkedin &&
      record.contact_linkedin === item.contact_linkedin
  );

  if (!item.company_name) {
    return 'Invalid: Company Name is required';
  }
  if (!item.company_linkedin) {
    return 'Invalid: Company Linkedin is required';
  }
  if (!item.company_ICP) {
    return 'Invalid: Company ICP is required';
  }
  if (!isValidICP(item.company_ICP)) {
    return 'Invalid: Company ICP is not included in the predefined dropdown list';
  }
  if (item.company_linkedin && !isValidLinkedIn(item.company_linkedin)) {
    return 'Invalid Company LinkedIn link. Use format: https://www.linkedin.com/company/company_name';
  }
  if (item.contact_email) {
    const emails = item.contact_email
      .split(',')
      .map((e: string) => e.trim())
      .filter((e: string) => e);

    const invalidEmails = emails.filter((email: string) => !isValidEmailFormat(email));

    if (invalidEmails.length > 0) {
      return 'Invalid Contact Email';
    }
  }
  if (item.company_twitter && !isValidTwitter(item.company_twitter)) {
    return 'Invalid Company Twitter link. Use format: https://twitter.com/name';
  }
  if (item.contact_linkedin && !isValidLinkedIn(item.contact_linkedin)) {
    return 'Invalid Contact LinkedIn link. Use format: https://www.linkedin.com/in/contactname/';
  }
  if (item.contact_twitter && !isValidTwitter(item.contact_twitter)) {
    return 'Invalid Contact Twitter link. Use format: https://twitter.com/name';
  }
  if (isDuplicate) {
    return 'Invalid: Duplicate row in file. Please remove it and re-upload';
  }
  try {
    const response = await checkHadOtherWatchlist(item.company_linkedin);
    if (response.message.includes('Company already exists in other watchlist')) {
      return "Warning: Company is in your teammate's watchlist. You can still add it to yours";
    }
    return 'Valid';
  } catch (error: any) {
    if (!item.contact_linkedin && error?.message.includes('Company already exists in watchlist')) {
      return 'Error: Already exists';
    }
    if (item.contact_linkedin && error?.message.includes('Company already exists in watchlist')) {
      return 'Valid';
    }
    throw error;
  }
};
export default getStatus;
