import {AttackCard, DefenceCard, Card} from './card';
// import { mitre } from '..';

export default class Player {
    /**Initialises as player1 and player2. Use /setname in chat to overwrite.*/
    public name: string;

    /** False for defender, True for attacker */
    public role: boolean;
    /** Additional role for bot player */
    public isBot: boolean;
    public resources: number;
    public opponent: boolean;

    public hand:Card[]
    public handMaxLength: number = 5;
    public deck?: Array<Card>;

    public '_id': string = '';

    public progress = {'initial-access': true, 'execution': false, 'persistence': false, 'privilege-escalation': false,
                            'defense-evasion': false, 'credential-access': false, 'discovery': false,
                            'lateral-movement': false, 'collecting': false, 'command-and-control': false,
                            'exfiltration': false, 'impact': false};

    public persistentProgress = {'initial-access': true, 'execution': false, 'persistence': false, 'privilege-escalation': false,
    'defense-evasion': false, 'credential-access': false, 'discovery': false,
    'lateral-movement': false, 'collecting': false, 'command-and-control': false,
    'exfiltration': false, 'impact': false};

    // mitre:Array<Object>

    /**
     *
     * @param role Attacker (true) or defender (false)
     * @param isBot Flag for bot players and chatbots
     * @param autogen Should a name be autogenerated?
     * @param name Name to be provided in the event that autogen is false - always required.
     */
    constructor(role: boolean, isBot: boolean, name: string, opponent: boolean) {
        // this.mitre = mitre
        this.role = role;
        this.isBot = isBot;
        this.name = name;
        this.hand = [];
        this.opponent = opponent;
        this.resources = 100;

    }

    public setPlayer(player: any){
        this.name = player.name;
        this.role = player.role;
        this.isBot = player.isBot;
        this._id = player._id;
        this.hand = player.hand;
        this.resources = player.resources;
        this.progress = player.progress;
        this.persistentProgress = this.progress

        
    }

    /**
     * Set the players name
     */
    public setName(name: string) {
        this.name = name;
    }

    /** Insert the specified number of attack techniques into the players hand
     * after checking that
     * @param numToDraw Number of cards to draw
    */
    public draw(numToDraw: number): void {
        if ((this.hand.length + numToDraw) > this.handMaxLength) {
            try {
                throw new RangeError();
            } catch (e) {
                if (e instanceof RangeError) {
                    console.error('Index out of range, attempting to draw more cards than the maximum');
                }
            }
        } else {
            for (let i = 0; i < numToDraw; i++) {
                const deckIndex = Math.floor(Math.random() * mitre.length);
                // If attacker
                // TODO Fix - only draws first column the attack belongs to
                if (this.isAttacker() == true) {
                    // only draw cards that are in progress object.
                    const tactic = mitre[deckIndex].kill_chain_phases[0].phase_name;

                    const tactics: any = Object.keys(this.progress!).filter((k) => (this.progress as any)[k]);

                    if (tactics.includes(tactic)) {
                        const technique = mitre[deckIndex].name;
                        const description = mitre[deckIndex].description;
                        const mitigatingSources: Array<string> = mitre[deckIndex].x_mitre_data_sources;

                        const c = new AttackCard(tactic, technique, description, mitigatingSources);
                        // Draw opponent cards faceup
                        c.faceup = (this.opponent ? false : true);
                        this.hand.splice(this.hand.length, 0, c);
                    } else {
                        this.generateAttackCard();
                    }



                }
                // If defender
                if (this.isDefender()) {
                    const c = this.generateDefenceCard();
                    c.faceup = (this.opponent ? false : true);
                    this.hand.splice(this.hand.length, 0, c);

                }
            }
        }
    }

    /** Discard a card from the players hand based off the index in the hand */
    public removeCard(i: number) {
        this.hand.splice(i, 1);
    }

    public isAttacker() {
        return(this.role ? true : false);
    }

    public isDefender() {
        return(!this.role ? true : false);
    }

    public generateDefenceCard(): DefenceCard {
        const deckIndex = Math.floor(Math.random() * mitre.length);
        // Generate a random selection of mitigating Sources
        const mitigatingSources:string[] = mitre[deckIndex].x_mitre_data_sources;
        const selector = Math.floor(Math.random() * mitigatingSources.length);
        console.log('Defence card generation: selector + ' + selector + ' : source: ' + mitigatingSources);
        return new DefenceCard(mitigatingSources[selector]);

    }

    /** Generate an attack card and add to the end of the players hand.
     * The attack card will only include techniques from tactics that
     * have been unlocked.
     */
    public generateAttackCard(): void {
        const deckIndex = Math.floor(Math.random() * mitre.length);
        if (this.isAttacker() == true) {
                // only draw cards that are in progress object.
                const tactic = mitre[deckIndex].kill_chain_phases[0].phase_name;

                const tactics: any = Object.keys(this.progress!).filter((k) => (this.progress as any)[k]);

                if (tactics.includes(tactic)) {
                    const technique = mitre[deckIndex].name;
                    const description = mitre[deckIndex].description;
                    const mitigatingSources: Array<string> = mitre[deckIndex].x_mitre_data_sources;

                    const c = new AttackCard(tactic, technique, description, mitigatingSources);
                    // Draw opponent cards facedown
                    c.faceup = (this.opponent ? false : true);
                    this.hand.splice(this.hand.length, 0, c);
                } else {
                    this.generateAttackCard();
                }
            }
    }

    // Set all cards in a players hand either faceup(pass true) or
    //  facedown (pass false)
    public setHandFaceup(up: boolean){
        this.hand.forEach((card) => {
            card.faceup = up;
        });
    }

    /** Nope */
    public setProgress(tactic: string) {
        switch (tactic) {
            case 'initial-access': {
                this.progress['initial-access'] = false;
                this.progress.execution= true;
                this.persistentProgress.execution= true;

                break;
            }
            case 'execution': {
                this.progress.execution= false;
                this.progress.persistence= true;
                this.persistentProgress.persistence= true;
                break;
            }
            case 'persistence': {
                this.progress.persistence= false;
                this.progress['privilege-escalation'] = true;
                this.persistentProgress['privilege-escalation'] = true;
                break;
            }
            case 'privilege-escalation': {
                this.progress.persistence= false;
                this.progress['defense-evasion'] = true;
                this.persistentProgress['defense-evasion'] = true;
                break;
            }
            case 'defense-evasion': {
                this.progress['defense-evasion'] = false;
                this.progress['credential-access'] = true;
                this.persistentProgress['credential-access'] = true;
                break;
            }
            case 'credential-access': {
                this.progress['credential-access'] = false;
                this.progress.discovery= true;
                this.persistentProgress.discovery= true;
                break;
            }
            case 'discovery': {
                this.progress.discovery= false;
                this.progress['lateral-movement'] = true;
                this.persistentProgress['lateral-movement'] = true;
                break;
            }
            case 'lateral-movement': {
                this.progress['lateral-movement'] = false;
                this.progress.collecting= true;
                this.persistentProgress.collecting= true;
                break;
            }
            case 'collecting': {
                this.progress.collecting= false;
                this.progress['command-and-control'] = true;
                this.persistentProgress['command-and-control'] = true;
                break;
            }
            case 'command-and-control': {
                this.progress['command-and-control'] = false;
                this.progress.exfiltration= true;
                this.persistentProgress.exfiltration= true;
                break;
            }
            case 'exfiltration': {
                this.progress.exfiltration= false;
                this.progress.impact= true;
                this.persistentProgress.impact= true;
                break;

            }
            case 'impact': {
                this.progress.impact= true;
                this.persistentProgress.impact= true;
                break;
            }
         }

    }



    public display(): void {
        console.log('Player name and role: ' + this.name + ': ' + this.role);
        console.log('Player hand: ' );
        console.log(this.hand);

    }



}
