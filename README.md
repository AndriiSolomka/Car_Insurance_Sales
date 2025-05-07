# The Car_Insurance_Sales Bot

## Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AndriiSolomka/Car_Insurance_Sales.git

2. **Open project:**

   ```bash
   cd Car_Insurance_Sales

3. **Install dependencies:**

   ```bash
   npm install
   
4. **Copy the .env.example.txt file to .env**

5. Run Docker
   
   ```bash
   docker-compose up --build

### How to Use the Bot

1. **Start the Conversation**  
   Send `/start` to the bot.  
   The bot will introduce itself and explain that it assists with car insurance purchases.

2. **Submit Documents**  
   The bot will prompt you to upload two photos:  
   • A photo of your passport.  
   • A photo of your vehicle identification document.

3. **Data Extraction**  
   The bot will process the uploaded photos using the **Mindee API** (or a mock API).  
   Extracted data will be displayed to you for confirmation.

4. **Confirm Data**  
   • If the data is incorrect, you can retake and resubmit the photos.  
   • If the data is correct, confirm it to proceed to the next step.

5. **Price Quotation**  
   The bot will inform you that the fixed price for the insurance is **100 USD**.  
   You will be asked if you agree with the price:  
   • If you agree, the bot will proceed to the next step.  
   • If you disagree, the bot will apologize and explain that the price is fixed.

6. **Insurance Policy Issuance**  
   The bot will generate a dummy insurance policy document using **OpenAI**.  
   The policy will be sent to you as a **PDF file**.

---

### Features

**AI-Driven Communication:**  
All messages and interactions are processed using OpenAI to simulate intelligent conversational capabilities.

**Document Processing:**  
Uses the **Mindee API** to extract data from uploaded photos.

**Dynamic Responses:**  
Handles user responses dynamically, including resubmissions and confirmations.
