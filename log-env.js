module.exports = {
    onPreBuild: ({ utils }) => {
      console.log('Logging build environment:');
      console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set');
      console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    },
  };