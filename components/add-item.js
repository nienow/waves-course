import React, {useState} from "react";
import TextField from "./text-field";

export default function AddItem({itemAdded}) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState(0);

  function submit() {
    if (WavesKeeper) {
      WavesKeeper.signAndPublishTransaction({
        type: 16,
        data: {
          fee: {
            "tokens": "0.05",
            "assetId": "WAVES"
          },
          dApp: '3N5YKzuN38Sxzv4hT44rBHT1vV8SkFwAPr5',
          call: {
            function: 'addItem',
            args: [
              {
                "type": "string",
                "value": name
              },{
                "type": 'integer',
                "value": Number(price) * 1e8
              },{
                "type": 'string',
                "value": JSON.stringify({
                  title: name,
                  desc: desc,
                  price: Number(price)
                })
              }]
          }, payment: []
        }
      }).then((tx) => {
        itemAdded();
      }).catch((error) => {
        alert('error adding item');
      });
    } else {
      alert('waves keeper not found');
    }
  }

  return <div>
    <TextField label="Item Name" onChange={setName}></TextField>
    <TextField label="Item Description" onChange={setDesc}></TextField>
    <TextField label="Item Price" onChange={setPrice}></TextField>
    <button className="flatButton" onClick={submit}>Submit</button>
  </div>
}
