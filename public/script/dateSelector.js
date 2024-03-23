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
        let datesAvailable = []
        rows.forEach((el) => {
            datesAvailable.push(new Row(el))
        })
        let rows_json = JSON.stringify(datesAvailable)
        console.log(rows_json)
        sendTimeCells(rows_json)
    }

    function sendTimeCells(rows_json) {
        $.ajax({
            url: '/sendtime',
            type: 'POST',
            contentType: 'application/json',
            data: rows_json,
            success: function(data) {
                console.log('Server response:', data);
            },
            error: function(xhr, status, error) {
                console.error('There was a problem with the request:', error);
            }
        });
    }

    let weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    let startingDate = moment()
    document.getElementById("startingDate").value = startingDate
    createInterface(startingDate)
    document.getElementById("startingDate").onchange = (ev) => {
        startingDate = moment(document.getElementById("startingDate").value)
        createInterface(startingDate)
    }

    document.getElementById("imdone").onclick = () => {
        getTimeCells()
    }


