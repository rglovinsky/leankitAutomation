var LeanKitClient = require("leankit-client");
var batchPromises = require("batch-promises");
var accountName = "chatmeter"
var email = "leankitUserName"
var password = "leankitPassword"
var client = new LeanKitClient(accountName, email, password)
const _ = require('lodash')
const Promise = require("bluebird");
const {all} = Promise
const boardId = 118706773

const createdAfterDate = new Date("October 9, 2016")
const createdBeforeDate = new Date("October 23, 2016")


const getBacklogLanes = boardId => client.getBoardBacklogLanes(boardId).then(allLanes => {
    const lanes = allLanes.filter(l => !["BackLog", "Under Consideration"].includes(l.Title))
    return {lanes, lanesByTitle: _.keyBy(lanes, 'Title')}
})

const getBoardLanes = boardId => client.getBoard(boardId).then(allLanes => {
    const lanes = allLanes.Lanes.filter(l => ["New", "Failed Testing", "Deploy", "Done"].includes(l.Title))
    return {lanes, lanesByTitle: _.keyBy(lanes, 'Title')}
})

const getArchiveLaneCards = boardId => client.getBoardArchiveLanes(boardId).then(allLanes => {
    const cards = allLanes[0].Lane.Cards
    return {cards, lanesByTitle: _.keyBy(cards, 'Title')}
})

/**
 * Grabs all Cards in Array of Lanes
 * @param lanes
 */
const allCardsForLanes = ({lanes}) => all(_.flatMap(lanes, ({Cards}) => Cards).map(c => client.getCard(boardId, c.Id)))

/**
 * Grabs the total number of cards and the total number of points for the cards.
 * Expects an Array of Card objects to be passed in
 * @param createdAfterDate, createdBeforeDate
 */
const calculateTotalForCards = (createdAfterDate, createdBeforeDate) => cards => {
    return cards.filter(c => c.DueDate && Date.parse(c.CreateDate) > createdAfterDate && Date.parse(c.CreateDate) < createdBeforeDate)
        .reduce(({totalCards, totalPoints}, {Size, TaskBoardTotalSize}) =>
            ({totalCards: totalCards + 1, totalPoints: totalPoints + Size + TaskBoardTotalSize}), {
            totalCards: 0,
            totalPoints: 0,
        }
    )
}



 getBacklogLanes(boardId)
 .then(allCardsForLanes)
 .then(calculateTotalForCards(createdAfterDate, createdBeforeDate))
 .then(function(resp){console.log("Backlog ", resp)})


 getBoardLanes(boardId)
 .then(allCardsForLanes)
 .then(calculateTotalForCards(createdAfterDate, createdBeforeDate))
 .then(function(resp){console.log("Board ", resp)})

getArchiveLaneCards(boardId)
    .then(function({cards}){
        return all(batchPromises(100, cards, card => { return client.getCard(boardId, card.Id); }))
    })
    .then(calculateTotalForCards(createdAfterDate, createdBeforeDate))
    .then(function(resp){console.log("Archive ", resp)})
