# Price Pal

Act as a Senior Full Stack Developer. Build a "Smart Product Pricing Manager" for a Salla store owner.

**Tech Stack:**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Database:** you choic or use lovable databse
- **Icons:** Lucide-react

**Core Requirement:**
The user is using "Lovable" or a similar AI builder. Ensure the code is ready to connect to a Supabase backend to SAVE and DELETE pricing scenarios.

### 1. Data Logic & Flexible Inputs
All numerical inputs must be **Optional**. If a user leaves a field empty, treat it as `0` in calculations.

**Inputs Section (Grouped logically):**
1.  **Product Info:**
    - Product Name (String)
    - Product Link (URL - Optional)
    - Image URL (String - Optional)
2.  **Merchant Costs (Your Expenses):**
    - Base Cost (Price from supplier)
    - Import Shipping (Cost to ship to you - Optional/0 for Dropshipping)
    - Packaging Cost (Boxes, wrapping - Optional)
    - Customs & Clearance (Optional)
    - Misc/Extra Costs (Optional)
3.  **Sales Variables:**
    - Customer Delivery Fee (What the customer pays, e.g., 25 SAR. Affects gateway fee calculation).
    - Payment Gateway Fee % (Default to 2.2, but allow user to edit).
    - Payment Fixed Fee (Default to 1.0, allow edit).

### 2. The Calculation Logic (The "Magic")
Create a helper function `calculatePricing` that runs in real-time.
- `Total_Merchant_Cost` = Base + Import_Shipping + Packaging + Customs + Misc.
- `Total_Transaction_Value` = Selling_Price + Customer_Delivery_Fee.
- `Gateway_Fee` = (Total_Transaction_Value * (Gateway_Percent / 100)) + Fixed_Fee.
- `Net_Profit` = Selling_Price - Total_Merchant_Cost - Gateway_Fee.

*Note: Handle cases where inputs are null/undefined by defaulting to 0.*

### 3. UI/UX Features
**A. The Calculator Card:**
- A clean, comprehensive form on the left/top.
- **Dynamic Results:** On the right/bottom, show 3 Cards:
    1.  **Aggressive (Launch):** Target ~20% Margin.
    2.  **Recommended (Growth):** Target ~35% Margin.
    3.  **Premium (Brand):** Target ~50% Margin.
- Each card must have a "Save to Dashboard" button.

**B. The Dashboard (Saved Products):**
- Fetch data from Supabase table `products`.
- Display saved items in a clean Data Table or Grid.
- **Columns:** Product Name, Total Cost, Suggested Price, Net Profit.
- **Actions:**
    - "Copy Price" button (copies to clipboard).
    - "Delete" button (Red Trash icon) -> Deletes from Supabase with a toast confirmation.

**C. Database Schema (For Context):**
Assume a Supabase table named `products` with columns:
`id`, `created_at`, `name`, `link`, `total_cost`, `selling_price`, `net_profit`, `margin_type`.

### 4. Implementation Details
- Use `zod` for input validation (allowing optional numbers).
- Use `sonner` or `use-toast` for notifications (e.g., "Product Saved", "Product Deleted").
- Ensure the UI is fully responsive (Mobile friendly).
- Use a dark/modern theme suitable for a developer tool.

Generate the full code, including the Supabase client setup, the main Page component, and the Logic/Types.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://calca7md.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3a71385b-17ff-4aae-a52f-c1b80ee6a0e7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
