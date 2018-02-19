const initialAppState = {
  name: process.env.REACT_APP_NAME,
  categoriesPath: 'section'
}

const app = (state = initialAppState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default app