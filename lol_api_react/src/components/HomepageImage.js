import React from 'react';
import api_key from '../config.js'

class HomepageImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: 'Search your Summoner',
            post: {},
            summoner_infos: [{},{}],
            summoner_id: '',
            summoner_account_id: '',
            status: 0,
            error_message: null,
            body: null,
            icon_url: ''
        };
    }

    handleChange = (event) => {
        this.setState({input: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
    }

    handleReset = (event) => {
        this.setState({input: ''});
    }

    handleRequest = (event) => {
        fetch('https://cors-anywhere.herokuapp.com/https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + this.state.input + '?api_key=' + api_key.api_key)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                console.log('res', result)
                if (result.status) {
                    this.setState({status: result.status.status_code})
                } else {
                    this.setState({status: 0})
                }
                this.setState( {summoner_id: result.id, summoner_account_id: result.accountId, post: result} )
                console.log('id: ' + this.state.summoner_id)
                this.setState({icon_url: 'http://ddragon.leagueoflegends.com/cdn/10.13.1/img/profileicon/' + result.profileIconId + '.png'})
                if (this.state.status === 0) {
                    console.log('id is : ' + this.state.summoner_id)
                    fetch('https://cors-anywhere.herokuapp.com/https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + this.state.summoner_id + '?api_key=' + api_key.api_key)
                        .then((response) => {
                            return response.json()
                        })
                        .then((result) => {
                            console.log('res is : ', result)
                            console.log('test is : ', result[0] ? result[0].queueType : null)
                            console.log('test2 is: ', result[1] ? result[1].queueType : null)
                            this.setState({summoner_infos: result})
                        })
                } else {
                    console.log(this.state.status)
                }
                fetch('https://cors-anywhere.herokuapp.com/https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/' + this.state.summoner_account_id + '?api_key=' + api_key.api_key)
                    .then((response) => {
                        return response.json()
                    })
                    .then((result) => {
                        console.log('result is : ', result)
                    })
                this.fillRenderr();
            })
        event.preventDefault();
    }

    fillRenderr = () => {
        switch(this.state.status) {
            case 400:
                this.setState( {error_message : <p>bad request</p>});
                break;
            case 401:
                this.setState( {error_message : <p>Unauthorized</p>});
                break;
            case 403:
                this.setState( {error_message : <p>Forbidden</p>});
                break;
            case 404:
                this.setState( {error_message : <p>Player Not Found</p>});
                break;
            case 415:
                this.setState( {error_message : <p>bad request</p>});
                break;
            case 429:
                this.setState( {error_message : <p>Rate limit exceeded</p>});
                break;
            case 503:
                this.setState( {error_message : <p>Service unavailable</p>});
                break;
            default:
                this.setState( {error_message: null});
        }
    }

    render() {
        const { input, status, summoner_infos, icon_url, error_message, body } = this.state;
        return (
            <>
                <main>
                    <form onSubmit={(this.handleSubmit, this.handleRequest)}>
                        <label>
                          <input style={{margin: '10px'}} type="text" value={input} onClick={this.handleReset} onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Envoyer" />
                    </form>
                </main>
                <aside>
        <p style={{justifyContent: 'space-between', alignSelf: 'left'}}>{summoner_infos[0] ? summoner_infos[0].summonerName : null} &emsp;{ icon_url ? <img style={{width: '100px', height: '100px'}} src={icon_url} alt=''></img> : null}</p>
                    <br></br>
                    <br></br>
                    { summoner_infos[0] ? summoner_infos[0].queueType : null}<br/>
                    <p>{summoner_infos[0] ? summoner_infos[0].tier : null} {summoner_infos[0] ? summoner_infos[0].rank : null}</p>
                    {summoner_infos[0].leaguePoints ? <p>{summoner_infos[0] ? summoner_infos[0].leaguePoints : null} lp</p> : null }
                    {(summoner_infos[0] && summoner_infos[0].wins && summoner_infos[0].losses) ? <p>{summoner_infos[0].wins}V {summoner_infos[0].losses}L</p> : null }
                    <br></br>
                    <br></br>
                    {summoner_infos[1] ? summoner_infos[1].queueType : null}<br/>
                    <p>{summoner_infos[1] ? summoner_infos[1].tier : null} {summoner_infos[1] ? summoner_infos[1].rank : null}</p>

                    {(summoner_infos[1] && summoner_infos[1].leaguePoints) ? <p>{summoner_infos[1].leaguePoints} lp</p> : null }
                    {(summoner_infos[1] && summoner_infos[1].wins && summoner_infos[1].losses) ? <p>{summoner_infos[1].wins}V {summoner_infos[1].losses}L</p> : null }
                    {error_message}
                    {body}
                </aside>
                <footer>
                </footer>
            </>
        );
    }
}

export default HomepageImage;