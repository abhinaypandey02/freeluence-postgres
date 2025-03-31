import { gql } from "@/__generated__";

export const GET_CURRENT_USER = gql(`
  #graphql
  query GetCurrentUser {
    user: getCurrentUser {
      id
      email
      username
      name
      photo
      role
      emailVerified
      isOnboarded
      instagramStats {
        isVerified
      }
    }
  }
`);

export const GET_USER_CURRENCY = gql(`
  #graphql
  query GetUserCurrency {
    user: getCurrentUser {
      locationID {
        country
      }
    }
  }
`);

export const GET_DEFAULT_ONBOARDING_DETAILS = gql(`
  #graphql
  query GetDefaultOnboardingDetails {
    getCurrentUser {
      id
      email
      name
      photo
      role
      isOnboarded
      instagramStats {
        username
      }
      bio
      username
      pictureUploadURL {
        uploadURL
        url
      }
      pricing {
        starting
      }
      gender
      category
      dob
      location {
        city
        currency
      }
      locationID {
        city
        country
      }
    }
  }
`);

export const GET_FEATURED_SELLERS_AND_POSTS = gql(`
  #graphql
  query GetFeaturedSellers {
    sellers: getFeaturedSellers {
      username
      name
      photo
      bio
      category
      instagramStats {
        username
        followers
        er
        isVerified
      }
    }
    posts:getFeaturedPosts {
      mediaURL
      thumbnailURL
      creatorImage
      creatorName
      creatorUsername
      creatorVerified
      postURL
      likes
      er
    }
    postings: getFeaturedPostings {
      id
      price
      currency
      title
      open
      minimumAge
      maximumAge
      barter
      applicationsCount
      minimumFollowers
      externalLink
      agency {
        photo
        name
        instagramStats {
          isVerified
        }
      }
    }
  }
`);

export const GET_SELLER = gql(`
  #graphql
  query GetSeller($username:String!) {
    getSeller(username: $username) {
      
        id
        name
        photo
        bio
        gender
        reviews {
          feedback
          rating
          name
          photo
          username
          portfolio {
            id
            imageURL
            link
          }
        }
        portfolio {
          caption
          id
          link
          imageURL
        }
        location {
          city
          country
          currency
        }
        category
        dob
        pricing {
          starting
        }
        instagramMedia {
          thumbnail
          caption
          link
          likes
          comments
          er
          timestamp
        }
        instagramStats {
          followers
          mediaCount
          username
          er
          averageLikes
          isVerified
        }
      
    }
  }
`);

export const GET_CHATS = gql(`
  #graphql
  query GetChats {
    chats:getChats {
      preview
      id
      user {
        id
        name
        photo
      }
      agency {
        id
        name
        photo
      }
      hasRead
    }
  }
`);
export const GET_CHAT = gql(`
  #graphql
  query GetChat($conversationID: Int!) {
    chat: getChat(conversationID: $conversationID) {
      user {
        id
        name
        photo
      }
      agency {
        id
        name
        photo
      }
      id
      preview
      hasRead
      messages{
        body
        createdAt
        byAgency
      }
    }
  }
`);

export const GET_ACCOUNT_DETAILS = gql(`
  #graphql
  query GetAccountDetails {
    user: getCurrentUser {
      id
      name
      contactEmail
      bio
      photo
      phone
      category
      gender
      dob
      username
      instagramStats {
        isVerified
      }
      locationID {
        city
        country
      }
      pricing {
        starting
      }
      pictureUploadURL {
        uploadURL
        url
      }
    }
  }
`);

export const GET_COUNTRIES = gql(`
  #graphql
  query GetCountries {
    countries: getCountries {
      value
      label
      countryCode
      currency
    }
  }
`);
export const GET_CITIES = gql(`
  #graphql
  query GetCities($countryID: Int!) {
    cities: getCities(countryID: $countryID) {
      value
      label
    }
  }
`);
export const SEARCH_SELLERS = gql(`
  #graphql
  query SearchSellers($filters: SearchSellersFilters!) {
    sellers: searchSellers(filters: $filters) {
      name
      username
      photo
      bio
      category
      gender
      instagramStats {
        isVerified
        followers
      }
      pricing {
        starting
      }
      location {
        city
        country
        currency
      }
    }
  }
`);
export const IS_USERNAME_AVAILABLE = gql(`
  #graphql
  query IsUsernameAvailable($username: String!) {
    isUsernameAvailable(username:$username)
  }
`);

export const GET_POSTING = gql(`
  #graphql
  query GetPosting($id: Int!) {
    posting:getPosting(id: $id){
      id
      maximumAge
      platforms
      minimumFollowers
      currencyCountry
      extraDetails
      agency {
        id
        name
        photo
        instagramStats {
          isVerified
        }
        username
      }
      deliverables
      externalLink
      applicationsCount
      description
      barter
      minimumAge
      open
      title
      currency
      price
      createdAt
      updatedAt
    }
  }
`);

export const GET_POSTING_REVIEWS = gql(`
  #graphql
  query GetPostingReviews($id: Int!) {
    posting:getPosting(id: $id){

      reviews {
        portfolio {
          imageURL
          link
        }
        rating
        photo
        username
      }
    }
  }
`);
export const GET_ALL_POSTINGS = gql(`
  #graphql
  query GetAllPostings($filters:SearchPostingsFilters!) {
    postings:getAllPostings(filters: $filters, pagination:{pageSize:20}) {
      id
      maximumAge
      minimumFollowers
      agency {
        name
        photo
        instagramStats {
          isVerified
        }
      }
      applicationsCount
      description
      barter
      minimumAge
      open
      title
      currency
      price
      createdAt
      platforms
      updatedAt
    }
  }
`);

export const GET_CURRENT_USER_APPLICATION_STATUS = gql(`
  #graphql
  query GetCurrentUserApplicationStatus($postingID:Float!) {
    user: getCurrentUser {
      id
      email
      name
      isOnboarded
      instagramStats {
        followers
      }
      contactEmail
      dob
      phone
    }
    hasApplied: getHasUserApplied(postingID: $postingID)
  }
`);

export const GET_USER_POSTINGS = gql(`
  #graphql
  query GetUserPostings {
    user: getCurrentUser {
      instagramStats {
        isVerified
      }
    }
    postings:getUserPostings {
      id
      maximumAge
      referralEarnings
      minimumFollowers
      applicationsCount
      description
      barter
      minimumAge
      extraDetails
      open
      title
      currency
      price
      createdAt
      platforms
      updatedAt
      deliverables
      currencyCountry
    }
  }
`);

export const GET_POSTING_APPLICATIONS = gql(`
  #graphql
  query GetPostingApplications($postingID:Int!) {
    posting: getPosting(id: $postingID){
      title
      extraDetails
      externalLink
    }
    applications:getPostingApplications(postingID: $postingID) {
      email
      referralEarnings
      phone
      status
      createdAt
      id
      user {
        name
        photo
        dob
        email
        gender
        bio
        username
        instagramStats {
          isVerified
          username
          followers
          averageLikes
          averageComments
          er
          mediaCount
        }
      }
      comment
    }
  }
`);

export const VERIFY_EMAIL = gql(`
  #graphql
  query VerifyEmail($token:String!) {
    verifyEmail(token: $token)
  }
`);

export const GET_PORTFOLIO_UPLOAD_URL = gql(`
  #graphql
  query GetPortfolioUploadURL {
    user:getCurrentUser {
      id
    }
    uploadURL: getPortfolioUploadURL {
      uploadURL
      url
    }
  }
`);

export const GET_USER_APPLICATIONS = gql(`
  #graphql
  query GetUserApplications {
    getPendingReviews
    uploadURL: getPortfolioUploadURL {
      uploadURL
      url
    }
    getUserApplications {
      status
      comment
      email
      phone
      createdAt
      posting {
        title
        agency {
          name
          username
          photo
        }
        id
      }
    }
  }
`);
