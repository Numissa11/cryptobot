import React, { Component } from 'react';
import './FreshData.css';

class FreshData extends Component {
      constructor() {
            super()
            this.state = {
                  freshData: [
                       
                  ]
            }
      }

      

      // this runs automatically when the componant is Mounted, ca va faire un appel au back
      // on a pas besoin de faire http:localhost:5000/api..., parce qu'on a déjà mis ca dans le proxy
      componentDidMount() {

       
            fetch('http://localhost:5000/tradingData')
            .then(res => res.json())
            .then(freshData => this.setState({ freshData }, () => console.log('Fresh data fetched..', freshData)))

                  // fetch va retourner une promesse, on fait '.then' et on va map sur le résultat = cet array d'objets pour le coup
                  // faut faire un autre '.then' et ca, ca nous donne nos data du back end, on va l'appeler freshData
                  // on doit mnt le mettre dans le state, donc on va faire un .setState,
                  // donc le freshData c'est notre réponse qui vient du back et on décide de l'appeler freshData
                  // va devenir le freshData du State (freshData : freshData) avec ES6 ca serait just (freshData) (c'est le cas en fait ici)
                  // dans freshData, on peut mettre un callBack dans le setState et on console.log les data fetched
                 
      }

      

      render() {
            return (

                  <div className="App" >
                        <h2> FRESH DATA </h2>
            <ul>
                  {this.state.freshData.map(singleData =>
                      <li key={singleData.id}> open: {singleData.open} high: {singleData.high} last: {singleData.last} low: {singleData.low} time: {singleData.timestamp}</li>  
                       

                        )}
            </ul>
           

                  </div>
            )
      }
}


export default FreshData;