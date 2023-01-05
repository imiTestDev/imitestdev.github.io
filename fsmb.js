export const FSM_BACKEND = {

    STATES: [
        {
            parent: null,
            id: -1,
            next_id: -1,
            check: function (input) {
                if (0 <= input && input < 8) {
                    this.next_id = 1;
                }
                else if(input <= 8 && input < 16){
                    this.next_id = 2;
                }
                else if(input <= 16 && input < 24){
                    this.next_id = 6;
                }
                else if(input <= 24 && input < 32){
                    this.next_id = 7;
                }
                else if(input <= 32 && input < 40){
                    this.next_id = 0;
                }
                else if(input <= 40 && input < 48){
                    this.next_id = 1;
                }
                else if(input <= 48 && input < 56){
                    this.next_id = 9;
                }
                else{
                    this.next_id = 0;
                }
                this.parent.switchState(this, this.transitions[this.next_id]);
            },
            transitions: [0,1,0,0,0,1,1,1,0,0,1,1,1,1]
        },
        {
            parent: null,
            id: -1,
            next_id: -1,
            check: function (input) {
                if (0 <= input && input < 8) {
                    this.next_id = 0;
                }
                else if(input <= 8 && input < 16){
                    this.next_id = 4;
                }
                else if(input <= 16 && input < 24){
                    this.next_id = 8;
                }
                else if(input <= 24 && input < 32){
                    this.next_id = 3;
                }
                else if(input <= 32 && input < 40){
                    this.next_id = 0;
                }
                else if(input <= 40 && input < 48){
                    this.next_id = 2;
                }
                else if(input <= 48 && input < 56){
                    this.next_id = 9;
                }
                else{
                    this.next_id = 6;
                }
                this.parent.switchState(this, this.transitions[this.next_id]);
            },
            transitions: [0,0,0,0,1,1,1,0,1,0,1,0,1,1,1,1]
        }
    ],

    switchState(cur_state, state) {
        Object.assign(cur_state, this.STATES[state]);
        console.log(cur_state.id);
    },

    validate(data_object, start_id) {
        console.log(data_object)
        const DATA_STATUS = {
            not_read: 0,
            valid: 1,
            invalid: 2
        }
        let current_data_validity = DATA_STATUS.not_read;
        let DATA = data_object.arrayScore;
        console.log(DATA);
        let recordscount = DATA.length;
        let END = 0;
        let INPUT_SEQ = '';
        let RECORD = [];
        let _cell_id = 0;
        let _currentstate = {};

        for (let index = 0; index < this.STATES.length; index++) {
            this.STATES[index].id = index;
            this.STATES[index].next_id = -1;
            this.STATES[index].parent = this;
        }

        this.switchState(_currentstate, start_id);
        console.log('assigned start ' + _currentstate.id);

        for (let index = 0; index < recordscount; index++) {
            RECORD = DATA[index].split('');
            INPUT_SEQ = RECORD;
            console.log(INPUT_SEQ);
            END = this.toNumber(INPUT_SEQ.pop());

            console.log('first state is\n' + start_id);
            console.log('last state is\n' + END);
            console.log('inputs are\n' + INPUT_SEQ);

            for (let index = 0; index < INPUT_SEQ.length; index++) {
                _cell_id = this.toNumber(INPUT_SEQ[index]);
                _currentstate.check(_cell_id);
                console.log(_cell_id + ' => ' + _currentstate.id);

            }

            console.log('last state on data : ' + END + '\nlast state calculated : ' + _currentstate.id);

            if (_currentstate.id == END) {
                start_id = _currentstate.id;
                console.log('new start ' + start_id);
                current_data_validity = DATA_STATUS.valid;
            } else {
                console.error('invalid chunk ');
                current_data_validity = DATA_STATUS.invalid;
                break;
            }
        }

        if (current_data_validity === DATA_STATUS.valid) {
            // context.log('DATA SET IS VALID!!');
            // var sessionStateSaveObj = {
            //     "PartitionKey": "SESSION_STATE",
            //     "RowKey": req.body.session_uuid + "-" + req.body.part,
            //     "Value": start_id,
            //     "State": "PASS"
            // };
            // context.bindings.scoreOutputTable.push(sessionStateSaveObj);
            
        } else if (current_data_validity === DATA_STATUS.invalid) {
            // / context.log('INVALID CHUNK FOUND!!');
            // var sessionStateSaveObj = {
            //     "PartitionKey": "SESSION_STATE",
            //     "RowKey": req.body.session_uuid + "-" + req.body.part,
            //     "Value": start_id,
            //     "State": "FAIL"
            // };
            // context.bindings.scoreOutputTable.push(sessionStateSaveObj);
            
        }

        return current_data_validity === DATA_STATUS.valid
    },

    toNumber(val) { // return val;
        return val.charCodeAt(0)
    }

}

