
const path = require('path');
const fs = require('fs');

class Ticket{
    constructor(numero, escritorio){
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl{

    constructor(){
        this.ultimo    = 0;
        this.hoy       = new Date().getDate();
        this.tickets   = [];
        this.ultimos_4 = [];

        this.init();
    }

    get ToJson(){
        return {
            ultimo: this.ultimo ,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos_4: this.ultimos_4,
        }
    }

    init(){
        const {hoy, tickets, ultimo, ultimos_4} = require('../db/data.json');
        
        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos_4 = ultimos_4;
        }else{
            this.guardarDB();
        }
    }

    guardarDB(){

        const dbPath = path.join(process.cwd() + '/db/data.json' );
        fs.writeFileSync(dbPath, JSON.stringify(this.ToJson));
    }

    siguiente(){
        this.ultimo += 1;
        this.tickets.push(new Ticket(this.ultimo, null));

        this.guardarDB();

        return 'Ticket '+ this.ultimo;
    }

    atenderTicket(escritorio){
        
        if (this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift();
        ticket.escritorio = escritorio;

        this.ultimos_4.unshift(ticket);

        if (this.ultimos_4.length > 4) {
            this.ultimos_4.splice(-1,1);
        }
        this.guardarDB();

        return ticket;
    }

}

module.exports = TicketControl;