# Order Management System

## Order Lifecycle

### Stage 1: Lead (Instagram DM)
- Customer inquires about fitment/price
- Auto-respond with fitment checker link
- Tag: `lead`

### Stage 2: Qualified (Fitment Confirmed)
- Customer confirms vehicle fitment
- Send Jotform link to collect details
- Tag: `qualified`

### Stage 3: Order Submitted (Jotform Completed)
- Customer submits year/make/model + contact info
- Review order details
- Send Stripe payment link
- Tag: `order_submitted`

### Stage 4: Payment Completed (Stripe Confirmed)
- Payment received via Stripe
- Order parts: universal double DIN radio + vehicle-specific bezel + wiring harness
- Order from Amazon with free shipping to customer address
- Tag: `paid`

### Stage 5: Shipped
- Amazon order confirmed
- Share tracking with customer
- Tag: `shipped`

### Stage 6: Delivered
- Customer confirms receipt
- Follow-up for review/testimonial
- Tag: `delivered`

### Stage 7: Complete
- 30-day replacement window closes
- Request review/UGC
- Tag: `complete`

## Order Tracking Spreadsheet
File: `operator-workspace/funnel-orders/orders.csv`

Columns:
- order_date
- customer_name
- customer_email
- customer_ig
- year_make_model
- radio_price
- stripe_payment_id
- amazon_order_id
- tracking_number
- stage
- notes

## Common Order Issues
- Wrong bezel/harness ordered → contact Amazon for replacement
- Radio arrives defective → 30-day replacement, ship new unit
- Customer can't install → recommend local audio shop
- Tracking shows delivered but customer says no → check with carrier
