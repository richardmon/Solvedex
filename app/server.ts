import app from './index'; // Import the app from your main server file

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 server running at ${PORT}`);
});
