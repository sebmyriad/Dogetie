import React, { PureComponent } from 'react'
import { sum, values } from 'lodash-es'
import moment from 'moment-timezone'
import CollectionSection from './sections/CollectionSection'
import GoalsSection from './sections/GoalsSection'
import HeaderSection from './sections/HeaderSection'
import PlatformsSection from './sections/PlatformsSection'
import PledgeSection from './sections/PledgeSection'
import ExchangeHelper from './utils/exchangeHelper'
import './assets/styles/shared/app.css'

class App extends PureComponent {
  state = {
    coins: [
      {ticker: 'DOGE', address: 'DKt3RDeQis5gNmiEQZKgZ7HYw63WXggo6n',},
      { ticker: 'BTC', address: '14DU5DcYruAKVQybmmsfYrRoF1N2PhzToQ' },
    ],
    balances: {
      DOGE: 0.0,
      BTC: 0.0,
    },
    endDate: moment.tz('2019-06-30 12:00', 'Europe/Belgium'),
    pledged: 0,
    goal: 9000000,
    goals: [
      {
        amount: 8000,
        title: 'Donator',
        includes: ['Free DOGE Tie', '(Fill in form on reddit)'],
      },
      {
        amount: 50000,
        title: 'Rockstar',
        includes: ['Free DOGE Tie','2 Special Ties', 'Respect', '(Fill in form on reddit)'],
      },
      {
        amount: 100000,
        title: 'Astronaut',
        includes: ['Free DOGE Tie', '2 Special Ties', 'Doge T-shirt', '(Fill in form on reddit)'],
      },
    ],
  }

  insights = {
    DOGE: 'https://dogechain.info/api/v1/address/balance/',
    BTC: 'https://btc-blockbook1.coinid.org/api/address',
  }

  exchangeHelpers = {}

  componentDidMount() {
    const { coins } = this.state
    coins.map((coin) => {
      const { address, ticker } = coin

      if (ticker !== 'DOGE') {
        this.exchangeHelpers[ticker] = ExchangeHelper(ticker)
      }

      return this.fetchAddressBalance({ address, ticker })
    })
  }

  convertToBTC = (ticker, balance) => this.exchangeHelpers[ticker].convert(balance, 'DOGE')

  fetchAddressBalance = ({ address, ticker }) => {
    const requests = [
      fetch(`${this.insights[ticker]}/${address}`),
    ]

    Promise.all(requests)
      .then(responses => Promise.all(responses.map(res => res.json())))
      .then((balances) => {
        const total = sum(balances.map(balance => Number(balance.balance)))
        return ticker !== 'DOGE' ? this.convertToBTC(ticker, total) : total
      })
      .then((btcValue) => {
        const { balances } = this.state
        const newBalances = Object.assign({}, balances)
        newBalances[ticker] = btcValue

        let pledged = sum(values(newBalances))

        if (pledged <= 0.0) {
          pledged = 0.0
        }
        this.setState({ balances: newBalances, pledged })
      })
      .catch(error => console.log(error))
  }

  render() {
    const {
      coins, endDate, goal, goals, pledged,
    } = this.state

    return (
      <div className="wrapper">
        <HeaderSection />
        <PledgeSection goal={goal} pledged={pledged} endDate={endDate} />
        <GoalsSection goals={goals} pledged={pledged} />
        <CollectionSection coins={coins} insights={this.insights} />
      </div>
    )
  }
}

export default App
