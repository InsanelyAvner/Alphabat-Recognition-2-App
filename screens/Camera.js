import * as React from "react"
import { Button, Image, View, Platform } from "react-native"

import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"


export default class PickImage extends React.Component {
  state = {
    image : null
  }

  

  render() {
    let { image } = this.state
    const NGROK_URL = "http://4398-101-100-162-250.ngrok.io/pred-digit" // NGROK is currently not working for me yet but I have my app and API ready

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
        <h1 style={{fontFamily: "Segoe UI"}}>Alphabat Detection</h1>
        <Button title="Select an image" onPress={this._pickImage} />
      </View>
    )
  }

  //  Get permission to open camera
  getPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== "granted") {
        alert("Camera permission is required 📷")
      }
    }
  }

  componentDidMount() {
    this.getPermissions()
  }


  uploadImage = async (uri) => {
    const data = new FormData()
    let fileName = uri.split("/")[uri.split("/").length - 1]
    let type = `image / ${uri.split(".")[uri.split(".").length -1]}`
    const fileToUpload = {
      uri: uri,
      name: fileName, // Ln 41
      type: type, // ln 42
    }


    data.append("digit", fileToUpload) // fileToUpload -> Ln 43
    fetch(NGROK_URL, {
      method: "POST",
      body: data,
      headers: {"content-type" : 'multipart/form-data'} 
    }).then((response) => { response.json() }).then((result) => { console.log("Sucess: ", result) })
    
    .catch((error) => {
      console.error("Error: ", error)
    })
  }


  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      })

      if (!result.cancelled) {
        this.setState({
          image: result.data
        })

        console.log(result.uri)
        this.uploadImage(result.uri)
      }
    }
    catch(e) {
      console.log(e)
    }
  }
}
