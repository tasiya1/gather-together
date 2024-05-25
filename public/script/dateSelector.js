/*
class Row {
    constructor(row){
        this.date = row.dataset.date
        this.cells = []
        row = Array.from(row.children)
        row.shift()
        row.forEach((el) => {
            if (el.classList.contains("selected")){
                this.cells.push(1)
            } else this.cells.push(0)
        });
    }
}
*/
function crcell(id) {
    let cell = document.createElement("div")
    cell.classList = "time-cell"
    cell.onclick = () => {
        if (cell.classList.contains("selected")){
            cell.classList.remove("selected")
        } else {
            cell.classList.add("selected")
        }
    }

    return cell
  }

  function createInterface(startingDate){
        let cellContainer = document.getElementById("timeCells")
        cellContainer.innerHTML = ""
        let row = document.createElement("div")
        row.classList.add("timelabel-row")    
        row.appendChild(document.createElement("p"))

        for (let i = 0; i < 24; i++){
        let timeLabel = document.createElement("p")
        timeLabel.innerText = i.toString().padStart(2, "0") + ":00"
        row.appendChild(timeLabel)
        } cellContainer.appendChild(row)

        for(let w = 0; w < 7; w++){
            row = document.createElement("div")
            row.classList.add("row")
            row.dataset.date = startingDate
            let dayLabel = document.createElement("p")
            dayLabel.innerText = startingDate.add(1, 'days').format('ddd') + " "  + (startingDate.format("MMM Do"));
            row.appendChild(dayLabel);

            for (let i = 0; i < 24; i++){
                let cell = crcell(i)
                row.appendChild(cell)
            } cellContainer.appendChild(row)
        }
    }

    function getTimeCells(){
        let rows = Array.from(document.getElementById("timeCells").querySelectorAll(".row"))
        let room = {roomCode: getRoomCode(), date: date, editedBy: "", cells: []}
        //let datesAvailable = {roomCode: getRoomCode()}
        rows.forEach((row) => {
            let r = []
            let ar = Array.from(row.children)
            for (let i = 1; i < ar.length; i++){
                if (ar[i].classList.contains("selected")){
                    r.push(1)
                } else r.push(0)
            } room.cells.push(r)
        })
        let room_datatosend = JSON.stringify(room)
        console.log(room_datatosend)
        sendTimeCells(room_datatosend)
    }

    function getRoomCode(){
        
        const currentUrl = window.location.href
        const urlParts = currentUrl.split('/')
        const roomCode = urlParts[urlParts.length - 2]
        
        //const roomCode = <%-roomCode%>
        return roomCode
    }

    function tellUserDataIsSaved(message){
        if (message === 'data ok'){
            document.getElementById("dataok-message").classList.remove("hidden-item")
            setTimeout(() => {
                document.getElementById("dataok-message").classList.add("hidden-item")
            }, 3000);
        }
    }

    function sendTimeCells(rows_json) {
        $.ajax({
            url: '/rooms/sendtime',
            type: 'POST',
            contentType: 'application/json',
            data: rows_json,
            success: function(data) {
                console.log('Server response:', data);
                tellUserDataIsSaved(data.message)
            },
            error: function(xhr, status, error) {
                console.error('There was a problem with the request:', error);
            }
        });
    }

let weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
let startingDate = moment()
//document.getElementById("startingDate").innerText = startingDate
if (document.getElementById("timeCells").children.length == 0) createInterface(startingDate)
/*
document.getElementById("startingDate").onchange = (ev) => {
    startingDate = moment(document.getElementById("startingDate").innerText)
    createInterface(startingDate)
}*/

document.getElementById("imdone").addEventListener("click", () => {getTimeCells()})