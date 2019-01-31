<template>
  <div class="page" v-bind:style= "{ backgroundColor: silver}">
    <h1>{{ msg }}</h1>
    <form action="http://localhost:8080/#/flashcards/">
    <input class= "button" type="submit" value="Begin" />
</form>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome To AWA Flashcards',
      silver: '#2F4F4F'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin-top: 250px;

}
.button {
  margin-top: 25px;
  border-radius: 15px;
  padding: 10px 10px 10px 10px;
  background-color: white;
  font-size: 15px;
  font-weight: bold;
  color: black;
  outline: none;
  cursor: pointer;
}
.page {
  padding-bottom: 25%;
  padding-top: 1%;
  text-align: center;
}
</style>
