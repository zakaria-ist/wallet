import { createRef } from "react"

const navigationHelper = {
  gotoHomeStoreList: ({ props, url, images }) => {
    props.navigation.navigate("HomeStoreList", {
      url,
      images
    })
  },
  navigationRef: createRef(),
  navigate(route, params) {
    try {
      this.navigationRef.current.navigate(route, params)
    } catch (error) {
      console.log("drawer error...")
    }
   }
}

export default navigationHelper