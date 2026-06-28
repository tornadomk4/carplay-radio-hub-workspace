# Weekly Business Report Generator
# Compiles all business metrics into a summary for Frank

param(
    [string]$WeekOf = (Get-Date -Format "yyyy-MM-dd")
)

$report = @"

=== CARPLAY RADIO HUB — WEEKLY REPORT ===
Week of: $WeekOf
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## METRICS (fill from manual tracking)

### Funnel
- Impressions: 
- Reach: 
- Engagements: 
- DMs Started: 
- Estimated Sales: 
- Ad Spend: 

### Revenue
- Units Sold: 
- Gross Revenue: 
- Cost of Goods: 
- Gross Profit: 

### Site
- Unique Visitors: 
- Fitment Checks Started: 
- Fitment Checks Completed: 
- Clicks to Checkout: 
- Conversion Rate: 

## CONTENT
- Posts This Week: 
- Best Performing Post: 
- New Followers: 

## ORDERS
- New Orders: 
- Shipped: 
- Issues/Returns: 

## TODO NEXT WEEK
1. 
2. 
3. 

"@

$reportPath = "C:\Users\frank\.openclaw\workspace\operator-workspace\reports\weekly-$WeekOf.md"
New-Item -ItemType Directory -Path (Split-Path $reportPath) -Force | Out-Null
$report | Set-Content $reportPath

$report
