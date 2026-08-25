import type { paths } from './api-contracts-types';

type RequestsGet = paths['/api/requests']['get'];
type RequestPost = paths['/api/requests']['post'];

export type RequestStatus = NonNullable<NonNullable<RequestsGet['parameters']['query']>['status']>;

export type UserRequest = NonNullable<
  NonNullable<RequestsGet['responses']['200']>['content']['application/json']['data']
>[number];

export type CreateUserRequestPayload = NonNullable<
  RequestPost['requestBody']
>['content']['application/json'];

export type RequestsListParams = NonNullable<RequestsGet['parameters']['query']>;

export type ProfileVerificationChecklist = {
  eligible: boolean;
  checks: Array<{
    key:
      | 'HAS_PROFILE'
      | 'HAS_NAME'
      | 'HAS_DESCRIPTION'
      | 'HAS_REGION'
      | 'HAS_CATEGORY'
      | 'HAS_LOGO'
      | 'HAS_WEBSITE'
      | 'HAS_WHATSAPP'
      | 'HAS_SOCIAL_LINK'
      | 'ACCOUNT_AGE';
    label: string;
    description: string;
    required: boolean;
    passed: boolean;
    message: string;
  }>;
};

export type ProfileVerificationRequirementsErrorDetails = {
  checklist: ProfileVerificationChecklist;
};
