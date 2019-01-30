import gql from 'graphql-tag'

export const queryCard = gql`
  query CardQuery ($cardId: String) {
    Card (id: $cardId) {
      question
      answer
    }
  }
`
export const CREATE_CARD = gql`
  mutation createCard($addTopic: ID, $addQuestion: String!, $addAnswer: String!, $dateShowed:DateTime!, $nextDateShow:DateTime!){
    createCard(
      topicId: $addTopic,
      question: $addQuestion,
      answer: $addAnswer,
      dateShowed: $dateShowed
      nextDateShow: $nextDateShow
    ) {
      id
    }
  }
`
export const ALL_TOPICS = gql`
  query topicQuery  {
    allTopics {
      id
      topic
    }
  }
`
export const queryFlashcardsByTopic = gql`
  query allCardBytopic($topicid:ID, $date: DateTime){
    allCards(filter: {
    AND: [{
      nextDateShow_lte: $date
    }, {
      topic:{id:$topicid}
    }]
  }){
      id
      question
      answer
      dateShowed
      nextDateShow
  }
}
`
export const CREATE_TOPIC = gql`
  mutation createTopic($topicNA: String!) {
    createTopic(
      topic: $topicNA,
    ) {
      id
    }
  }
`
export const CALCULATING_DATE_QUERY = gql`
query CalculatingDateQuery($id: ID!, $dateShowed: DateTime!, $nextDateShow: DateTime!, $feeling: String!){
 getNewDate(
   id: $id
   dateShowed: $dateShowed
   nextDateShow: $nextDateShow
   feeling: $feeling
 ){
   newDates
 }
}
`
export const DELETE_TOPIC = gql`
mutation DeleteTopickMutation($id: ID!){
  deleteTopic(
    id:$id
  ){
    topic
  }
}
`
export const DELETE_CARD = gql`
mutation DeleteCardkMutation($id: ID!){
  deleteCard(
    id:$id
  ){
    id
  }
}
`
