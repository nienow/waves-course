import React, {useState} from "react";
import TextField from "./text-field";

export default function SignUp({onSignUp}) {
  const [name, setName] = useState('');

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
            function: 'register',
            args: [
              {
                "type": "string",
                "value": name
              }]
          }, payment: []
        }
      }).then((tx) => {
        onSignUp();
      }).catch((error) => {
        alert('error registering');
      });
    } else {
      alert('waves keeper not found');
    }
  }

  return <div>
    <TextField label="Supplier Name" onChange={setName}></TextField>
    <button className="flatButton" onClick={submit}>Submit</button>
  </div>
}
