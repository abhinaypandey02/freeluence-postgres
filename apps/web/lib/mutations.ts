import { gql } from "../__generated__";

export const UPDATE_ONBOARDING_BASIC_DETAILS = gql(`
  #graphql
  mutation UpdateOnboardingBasicDetails($basicDetails: OnboardingBasicDetailsInput!) {
    updateOnboardingBasicDetails(basicDetails: $basicDetails)
  }
`);

export const UPDATE_ONBOARDING_DOB = gql(`
  #graphql
  mutation UpdateOnboardingDOB($dobDetails: OnboardingDOBInput!) {
    updateOnboardingDOB(dobDetails: $dobDetails)
  }
`);
export const UPDATE_ONBOARDING_USERNAME = gql(`
  #graphql
  mutation UpdateOnboardingUsername($usernameDetails: OnboardingUsernameInput!) {
    updateOnboardingUsername(usernameDetails: $usernameDetails)
  }
`);

export const UPDATE_ONBOARDING_LOCATION = gql(`
  #graphql
  mutation UpdateOnboardingLocation($locationDetails: OnboardingLocationInput!) {
    updateOnboardingLocation(locationDetails: $locationDetails){
      name
      symbol
    }
  }
`);

export const UPDATE_ONBOARDING_PRICING = gql(`
  #graphql
  mutation UpdateOnboardingPricing($pricingDetails: OnboardingPriceInput!) {
    updateOnboardingPricing(pricingDetails: $pricingDetails)
  }
`);

export const COMPLETE_ONBOARDING = gql(`
  #graphql
  mutation CompleteOnboarding {
    completeOnboarding
  }
`);

export const READ_MESSAGE = gql(`
  #graphql
  mutation ReadMessage($conversationID:Int!) {
    readMessage(conversationID: $conversationID)
  }
`);

export const SEND_CHAT = gql(`
  #graphql
  mutation SendChat($conversationID: Int!, $body:String!) {
    sendMessage(conversationID: $conversationID, body: $body)
  }
`);

export const UPDATE_USER = gql(`
  #graphql
  mutation UpdateUser($updatedUser: UpdateUserInput!) {
    updateUser(updatedUser: $updatedUser)
  }
`);

export const UPDATE_USER_LOCATION = gql(`
  #graphql
  mutation UpdateUserLocation($updatedLocation: UpdateLocation!) {
    updateUserLocation(updatedLocation: $updatedLocation)
  }
`);

export const DISCONNECT_INSTAGRAM = gql(`
  #graphql
  mutation DisconnectInstagram {
    disconnectInstagram
  }
`);

export const DISCONNECT_GOOGLE = gql(`
  #graphql
  mutation DisconnectGoogle {
    disconnectGoogle
  }
`);

export const APPLY_NOW = gql(`
  #graphql
  mutation ApplyNow($postingID:Float!, $email:String!, $comment:String) {
    applyToPosting(postingID: $postingID, email: $email, comment: $comment)  
  }
`);
