const moment = require ('moment')

import { fromEvent } from 'graphcool-lib'

const updateCardNextRevision = (
 id,
 newDates,
 currentDate,
 client
) =>
 client
   .request(
     `
     mutation updateCard($id: ID!, $newDates: DateTime!, $currentDate: DateTime!) {
         updateCard (id: $id, nextDateShow: $newDates, dateShowed: $currentDate){
         id
         nextDateShow
         dateShowed
       }
     }

     `,
     {
       id,
       newDates,
       currentDate
     }
   )
   .then(queryResult => queryResult.updateCard)



export default async event => {
 // you can use ES7 with async/await and even TypeScript in your functions :)

  // variables that comes from graphcool inputs
  const nextDateShow = event.data.nextDateShow
  const dateShowed = event.data.dateShowed
  const feeling = event.data.feeling
  const id = event.data.id

  // take it from the javascript lib
  const lib = fromEvent(event)
  const client = lib.api('simple/v1')

  // calculating dates between two dates in days
 //  const date = new Date(dateShowed)
  const date_diff_in_days = function(dateShowed, nextDateShow) {
   const dt1 = new Date(dateShowed);
   const dt2 = new Date(nextDateShow);
   const days_difference = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
   return days_difference
 }

   // determinating wheather what days should be added to new date
   const days = date_diff_in_days(dateShowed, nextDateShow)

   if(feeling === "hard") {
       days = 2
   }
   if(feeling === "median" && days != 0) {
     days = Math.round(days / 2)
   } else {
     days += 2
   }
   if(feeling === "easy" && days != 0) {
     days *= 2
   } else {
     days += 5
   }
   // add days into the new date, which give the new nextDateRep
   const newDates = new Date(nextDateShow)
   newDates.setDate(newDates.getDate() + days);
   const currentDate = new Date()
 await updateCardNextRevision(id, newDates, currentDate, client)
 return {
   data: {
     newDates: newDates
   }
 }
}


}
