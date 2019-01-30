<template class= "flashcards">
  <div class="cards" v-bind:style= "{ backgroundColor: silver}">
    <h1>{{topicName}}</h1>
    <h3 class="topics">Topics</h3>
    <ul class="deck">
      <li class="topic" v-on:click = "show = !show,  bytopic(topic.id, topic.topic)" v-for = "topic in allTopics" :key = "topic.id">{{topic.topic}}</li>

      <button class="topicAdd" v-on:click="topicadd = !topicadd">Add Topic</button>
      <div v-if="topicadd" class="model2">
        <div class="modal-content">
          <span v-on:click = "topicadd = false" class="close2">&times;</span>
          <div class="topicNA">
            <label for="question">Topic:</label>
            <input type="text" v-model="topicNA" value="">
            <br>
            <button v-on:click = "topicAdd()">Add topic</button>
          </div>
        </div>
      </div>
      <button v-on:click="deleteTopic()" class="topicDel">delete Topic</button>
    </ul>
    <div class=""  v-if = "show">
      <button class="AddCard" v-on:click="AddCardDisplay = !AddCardDisplay">AddCard</button>
      <button class="DeleteC" v-on:click = "deleteCard()">Delete Card</button>

      <div v-if="AddCardDisplay" id="myModal" class="modal">
        <div class="modal-content">
          <span v-on:click = "AddCardDisplay = false" class="close">&times;</span>
          <div class="addForm">
            <label for="question">Question:</label>
            <input type="text" v-model="addQuestion" name="question" value="">
            <br>
            <label for="answer">answer:</label>
            <input type="text" v-model="addAnswer" name="question" value="">
            <br>
            <button v-on:click = "createCard()" >Add Card</button>
          </div>
        </div>
      </div>

      <h3 class = 'currentSide'>{{currentSide}}</h3>
      <div class="qa" v-bind:style="color">

        <button v-if = "thisAnswer" class = "thisQuestion" v-on:click = "thisQuestion(), currentQuestion = !currentQuestion" >Question</button>

        <button class="easy" v-on:click="easyMode(allCards)" v-if="thisAnswer">Easy</button>
        <button class="median" v-on:click="medianMode(allCards)" v-if="thisAnswer">median</button>
        <button class="hard" v-on:click="hardMode(allCards)" v-if="thisAnswer">Hard</button>

          <p class= "lastQuestion" v-if = "currentQuestion">{{lastQuestion}}</p>
        <p class="demo" v-on:click = "question = !question, updataAnswer(allCards, a)" v-if="question">{{currentCard}}</p>
        <p class = "answer" v-if = "thisAnswer" v-on:click="lastAnswer(allCards), color.backgroundColor = $event.target.value">{{currentAnswer}}</p>
      </div>
        <button class="button" v-on:click = "thisAnswer = !thisAnswer, updataQuestion(allCards, i)" v-if="thisbutton">{{card}}</button>
      </div>
  </div>
</template>
<script>
import { CREATE_CARD, ALL_TOPICS, queryFlashcardsByTopic, CREATE_TOPIC, CALCULATING_DATE_QUERY, DELETE_TOPIC, DELETE_CARD } from '@/graphql'
let currentCard
let card = 'Start'
let currentAnswer
let i = 0
let a = 0
let currentSide = 'Start'
let lastQuestion

export default {
  name: 'flashcards',
  data () {
    return {
      currentSide,
      thisAnswer: false,
      currentQuestion: false,
      currentCard,
      card,
      i,
      a,
      currentAnswer,
      question: false,
      color: 'black',
      silver: '#2F4F4F',
      lastQuestion,
      AddCardDisplay: false,
      addQuestion: '',
      addAnswer: '',
      addTopic: '',
      show: false,
      topicid: '',
      topicName: 'Flashcards',
      topicadd: false,
      topicNA: '',
      dateShowed: '',
      nextDateShow: '',
      cardid: '',
      thisbutton: true

    }
  },
  methods: {
    updataQuestion (front, i) {
      if (front.length === 0) {
        alert('add card to this topic')
        this.thisAnswer = false
        location.reload()
      } else if (this.a === front.length) {
        this.card = 'Start again'
        this.a = 0
        this.i = 0
        this.currentCard = ''
        this.currentAnswer = ''
        this.question = true
      } else if (this.a === this.i) {
        this.thisbutton = false
        this.currentCard = front[this.i].question
        this.currentSide = 'Question'
        this.cardid = front[this.i].id
        this.i++
        this.i = this.i
        this.thisAnswer = false
        this.question = true
        this.lastQuestion = ''
      } else {
        this.currentAnswer = ''
        this.thisAnswer = false
        alert('Please hit the card to show answer if you want to see the next question')
      }
    },
    bytopic (topicsid, topic) {
      this.topicid = ''
      this.thisAnswer = false
      if (this.show === true) {
        this.addTopic = topicsid
        this.topicName = topic.charAt(0).toUpperCase() + topic.slice(1)
        this.a = 0
        this.i = 0
        this.currentCard = ''
        this.currentAnswer = ''
        this.topicid = topicsid
        this.card = 'Start'
        this.show = true
      } else {
        location.reload()
      }
    },
    updataAnswer (back, a) {
      if (this.i > this.a) {
        this.currentAnswer = back[this.a].answer
        this.dateShowed = back[this.a].dateShowed
        this.nextDateShow = back[this.a].nextDateShow
        this.cardid = back[this.a].id
        this.currentSide = 'Answer'
        this.a++
        this.a = this.a
        this.thisAnswer = true
        this.question = false
      }
    },
    lastAnswer (lastA) {
      if (this.a === lastA.length) {
        this.card = 'Start again?'
        this.a = 0
        this.i = 0
        this.currentCard = ''
        this.currentAnswer = ''
        this.question = true
      }
    },
    thisQuestion () {
      this.lastQuestion = this.currentCard
    },
    createCard () {
      if (this.addQuestion === '' || this.addAnswer === '') {
        alert("box can't be empty!!")
      } else {
        const { addQuestion, addAnswer, addTopic } = this.$data
        this.$apollo.mutate({
          mutation: CREATE_CARD,
          variables: {
            addTopic,
            addQuestion,
            addAnswer,
            dateShowed: new Date(),
            nextDateShow: new Date()
          }
        })
        this.addAnswer = ''
        this.addQuestion = ''
        location.reload()
      }
    },
    topicAdd () {
      if (this.topicNA === '') {
        alert("box can't be empty!!")
      } else {
        const { topicNA } = this.$data
        this.$apollo.mutate({
          mutation: CREATE_TOPIC,
          variables: {
            topicNA
          }
        })
        this.topicNA = ''
        this.topicadd = false
        location.reload()
      }
    },
    easyMode (front) {
      const {cardid, dateShowed, nextDateShow} = this.$data
      this.$apollo.query({
        query: CALCULATING_DATE_QUERY,
        variables: {
          id: cardid,
          dateShowed: dateShowed,
          nextDateShow: nextDateShow,
          feeling: 'easy'
        }
      })
      if (this.a === front.length) {
        this.card = 'Start again'
        this.a = 0
        this.i = 0
        this.currentCard = ''
        this.currentAnswer = ''
        this.question = true
      } else if (this.a === this.i) {
        this.currentCard = front[this.i].question
        this.currentSide = 'Question'
        this.i++
        this.i = this.i
        this.thisAnswer = false
        this.question = true
        this.lastQuestion = ''
      }
    },
    medianMode (front) {
      const {cardid, dateShowed, nextDateShow} = this.$data
      this.$apollo.query({
        query: CALCULATING_DATE_QUERY,
        variables: {
          id: cardid,
          dateShowed: dateShowed,
          nextDateShow: nextDateShow,
          feeling: 'median'
        }

      })
      if (this.a === front.length) {
        this.card = 'Start again'
        this.a = 0
        this.i = 0
        this.currentCard = ''
        this.currentAnswer = ''
        this.question = true
      } else if (this.a === this.i) {
        this.currentCard = front[this.i].question
        this.currentSide = 'Question'
        this.i++
        this.i = this.i
        this.thisAnswer = false
        this.question = true
        this.lastQuestion = ''
      }
    },
    hardMode (front) {
      const {cardid, dateShowed, nextDateShow} = this.$data
      this.$apollo.query({
        query: CALCULATING_DATE_QUERY,
        variables: {
          id: cardid,
          dateShowed: dateShowed,
          nextDateShow: nextDateShow,
          feeling: 'hard'
        }
      })
      if (this.a === front.length) {
        this.card = 'Start again'
        this.a = 0
        this.i = 0
        this.currentCard = ''
        this.currentAnswer = ''
        this.question = true
      } else if (this.a === this.i) {
        this.currentCard = front[this.i].question
        this.currentSide = 'Question'
        this.i++
        this.i = this.i
        this.thisAnswer = false
        this.question = true
        this.lastQuestion = ''
      }
    },
    deleteTopic () {
      const {topicid} = this.$data
      this.$apollo.mutate({
        mutation: DELETE_TOPIC,
        variables: {
          id: topicid
        }
      })
      location.reload()
    },
    deleteCard () {
      const {cardid} = this.$data
      this.$apollo.mutate({
        mutation: DELETE_CARD,
        variables: {
          id: cardid
        }
      })
      location.reload()
    }
  },
  apollo: {
    allCards: {
      query: queryFlashcardsByTopic,
      variables () {
        return {
          topicid: this.topicid,
          date: new Date()
        }
      }
    },
    allTopics: {
      query: ALL_TOPICS
    }
  }
}
</script>

<style scoped>
  .close2 {
    cursor: pointer;
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    margin-top: -80px
  }
  .model2 {
    text-align: center;
    position: absolute; /* Stay in place */
    z-index: 2; /* Sit on top */
    padding-top: 80px; /* Location of the box */
    left: 0;
    top: 0;
    width: 500px; /* Full width */
    height: 350px; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: black; /* Fallback color */
    /*background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    background-color: black;
    margin-left: 500px;
    margin-top: 20px;
  }
  .topicNA {
    color: white;
  }
  .topicAdd {
    margin-left: 120px;
    float: left;
  }
  .topicDel {
    margin-top: -41px;
    margin-right: 120px;
    float: left;
    margin-right: 120px;
  }
  .topics {
    text-align: left;
    float: left;
    margin-left: 60px;
    font-size: 25px;
  /*  margin-top: 1%;*/
    color: white;
    margin-bottom: -8%;
    text-align: center;
    position: relative;
  }
  .topic:hover {
    background-color: #555;
    color: white;
    font-size: 22px;
  }
  .deck {
    text-align: left;
    float: left;
    padding:0;
    background-color: white;
    padding-bottom: 10px;
    margin-top: 80px;
    width: 200px;
    position: relative;
  }
  .topic {
    list-style: none;
    padding-top: 30px;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
    position: relative;
    padding: 10px 16px;
  }
  .addForm {
    color: white;
  }
  .addForm label, input, button {
    margin-top: 50px;
  }
  .AddCard {
    margin-left: -700px;
    border-radius: 50%;
    padding: 6px 6px 6px 5px;
    background-color: white;
    color: black;
    font-weight: bold;
    outline: none;
    cursor: pointer;
    margin-top: 30px;
    margin-bottom: -500px;
  }
  .DeleteC {
    border-radius: 50%;
    padding: 6px 6px 6px 5px;
    background-color: white;
    color: black;
    font-weight: bold;
    outline: none;
    cursor: pointer;
    margin-left: 50px;
  }
  .cards {
    padding-bottom: 100%;
    padding-top: 1%;
    text-align: center;
  }
  .qa {
    position: absolute;
    width: 45%;
    height: 380px;
    margin-left: 28%;
    border-radius: 10px;
    overflow: hidden;
    background: white;
    color: black;
    margin-top: 10%;
    box-shadow: 5px 10px;
  }
  .demo {
    text-align: center;
    margin-bottom: -60px;
    padding-bottom: 50px;
    overflow: hidden;
    cursor: pointer;
  }
  h1 {
    text-align: center;
    padding-top: 2%;
    color: white;
    font-weight: bold;
  }
  p {
    text-align: center;
    font-size: 16px;
    color: black;
  }
  .button {
    margin-top: 550px;
    border-radius: 15px;
    padding: 10px 10px 10px 10px;
    background-color: white;
    font-size: 15px;
    font-weight: bold;
    color: black;
    outline: none;
    margin-right: 200px;
    cursor: pointer;
  }
  .thisQuestion {
    display: none;
    border-radius: 15px;
    padding: 5px 5px 5px 5px;
    margin-top: 1px;
  }
  .lastQuestion {
    font-size: 20px;
  }

  .demo, .answer{
    margin-top: 170px;
    font-size: 25px;
    text-align: center;
  }
  .answer {
    margin-top: 105px;
  }
  .currentSide {
    font-size: 25px;
  /*  margin-top: 1%;*/
    color: white;
    margin-bottom: -8%;
    text-align: center;
    margin-right: 200px;
  }
  .modal {
    position: absolute; /* Stay in place */
    z-index: 2; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 500px; /* Full width */
    height: 550px; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: black; /* Fallback color */
    /*background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    background-color: black;
    margin-left: 30%;
    margin-top: 120px;
  }
  .close {
    cursor: pointer;
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    margin-top: -100px;
  }
  .easy, .median, .hard {
    margin-top: 1px;
    border-radius: 15px;
    padding: 5px 5px 5px 5px;
    cursor: pointer;
    margin-left: 50px;
    margin-right: 50px;
    outline: none;
  }
  @media (min-width:200px) and (max-width:800px) {
    .button {
      margin-top: 500px;
    }
    .deck, .topics {
    }
  }
  @media (min-width:800px) and (max-width:900px) {
    .button {
      margin-top: 500px;
    }
  }
  @media (min-width:900px) and (max-width:1200px) {
    .button {
      margin-top: 500px;
    }
  }
  @media (min-width:1200px) and (max-width:1400px) {
    .button {
      margin-top: 550px;
    }
  }
</style>
