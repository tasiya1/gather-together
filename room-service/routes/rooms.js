const express = require('express')
const path = require('path');
const Room = require('../models/room')
const User = require('../../auth-service/models/user')
const TimeCells = require('../models/timecells');
const router = express.Router()
const ejs = require('ejs')
const moment = require('moment')

router.get('/', (req, res) => {
    //res.send('this is filter route')
    res.sendFile(path.join(__dirname, '..', 'public', 'myRooms.html'));
})

router.post('/sendtime', async (req, res) => {
    const requestData = req.body
    const roomCode = requestData.roomCode
    console.log("Room code: " + roomCode);
    console.log(requestData);
    res.json({ message: 'data ok' });

    //const user = await User.findOne({username: "baba_buba"})
    
    const user = await User.findById(req.userId)    
    const aRoom = await Room.findOne({code: roomCode})
    const room = await TimeCells.findOne({roomCode: roomCode, editedBy: user.id})
    if (!room) {
        let r = new TimeCells({cells: requestData.cells, date: aRoom.startingDate, roomCode: roomCode, editedBy: user.id})
        await r.save()
        console.log(JSON.stringify(r))
    } else {
        room.cells = requestData.cells
        room.date = aRoom.startingDate
        await room.save()
        console.log(JSON.stringify(room))
    }
    //user.rooms.splice(0, user.rooms.length)
    //await user.save()
    
});

router.get('/createroom', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'createRoom.html'));
})

router.post('/createroom', async (req, res) => {
    const roomCode = req.body.roomCode
    const startingDate = req.body.startingDate
    
    if (await Room.findOne({code: roomCode})) {
        return res.json({ message: "Кімнатка з таким кодом вже існує🙄" });
    }
    
    //const user = await User.findOne({username: "baba_buba"})
    console.log(req.userId)
    const user = await User.findById(req.userId)

    let room = new Room({startingDate: startingDate, createdBy: user.id, code: roomCode})
    //user.roomsCreated.push(roomCode);
    await room.save();

    return res.redirect('/my')
    //return res.json({ message: "Кімнатку створено😊" });
})

router.delete('/:roomCode/delete', async (req, res) => {
    const roomCode = req.params.roomCode
    console.log(roomCode)
    try {
        const rooma = await Room.findOne({ code: roomCode })
        const user = await User.findById(req.userId)

        if (!rooma || !user) {
            return res.status(404).send({ message: 'шось бракує' });
        }

        if (rooma.createdBy.equals(user._id)) {
            const result = await Room.findOneAndDelete({ code: roomCode });
            if (result) {
                console.log("rooma deleted");
                res.status(200).send({ message: 'rooma deleted' })
            }

        } else {
                res.status(404).send({ message: 'not your rooma' })
        }
        
    } catch (error) {
        res.status(500).send({ message: 'errora', error })
    }
})

router.get('/joinroom', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'joinRoom.html'));
})

router.post('/joinroom', async (req, res) => {
    const roomCode = req.body.roomCode
    console.log(roomCode);

    if (await Room.findOne({code: roomCode})) {
        return res.redirect('/' + req.body.roomCode + '/edit')
    }
    
    return res.json({ message: "Не знайдено такої кімнатки😥" });
})

/*
router.get('/testroom', (req, res) => {
    const numbers = [1, 2, 3]
    //res.sendFile(path.join(__dirname, '..', 'public', 'selectTime.html'));
    res.sendFile(path.join(__dirname, '..', 'public', 'selectTime.html'));
})
*/

function createTimeCells (adminRoom, userId) {
    let room = new TimeCells()
    room.roomCode = adminRoom.code
    room.date = moment(adminRoom.startingDate) 
    room.editedBy = userId
    //for (i = 0; i < 7; i++){
       //let date = startingDate.add(1, 'days').format('ddd') + " "  + (startingDate.format("MMM Do"));
       room.cells = new Array(7).fill(
        new Array(24).fill(0, 0, 24), 
        0, 7)
    //}
    return room
}

router.get('/:roomCode/edit', async (req, res) => {
    const roomCode = req.params.roomCode
    console.log(roomCode);
    const adminRoom = await Room.findOne({code: roomCode})
    if (!adminRoom) {
        res.json({ message: "Не знайдено такої кімнатки😥" });
    }
    let rooma = await TimeCells.findOne({roomCode: roomCode, editedBy: req.userId})
    if (!rooma) {
        rooma = createTimeCells(adminRoom, req.userId)
        rooma.save()
    }
    console.log(JSON.stringify(rooma))
    return res.render(path.join(__dirname, '..', 'public', 'selectTime.ejs'), {rooma, roomCode});
})

async function compile(roomCode) {
    let rooms = []
    let intersections = []
    for (let i = 0; i < 7; i++) intersections.push(new Array(24).fill(0))

    //find date intersections
    let rooma = await Room.findOne({code: roomCode})
    let roomaDate = rooma.startingDate
    rooms = await TimeCells.find({roomCode: roomCode})
    let size = rooms.length
    //find cell intersections at given dates
    for (let room of rooms){
        for (let i = 0; i < room.cells.length; i++){
            for (let j = 0; j < room.cells[0].length; j++){
                if (room.cells[i][j] == 1)
                    intersections[i][j]++
            }
            //console.log(intersections[i])
        }
        //console.log(intersections)
    }
    return { intersections, size, roomaDate }
}

router.get('/:roomCode/compile', async (req, res) => {
    const roomCode = req.params.roomCode;
    let { intersections, size, roomaDate } = await compile(roomCode)
    //return res.json({intersections: await compile(roomCode)})
    //const rooms = await TimeCells.find({roomCode: roomCode})
    return res.render(path.join(__dirname, '..', 'public', 'compile.ejs'), {time_intersections: intersections, size: size, roomaDate: roomaDate});
})

router.get('/my', async (req, res) => {
    const user = await User.findById(req.userId)

    const roomsCreated = await Room.find({createdBy: user.id})
    const roomsJoined = await TimeCells.find({editedBy: user.id})

    console.log(roomsCreated + " " + roomsJoined)
    return res.render(path.join(__dirname, '..', 'public', 'myrooms.ejs'), {roomsCreated: roomsCreated, roomsJoined: roomsJoined});
})

module.exports = router;