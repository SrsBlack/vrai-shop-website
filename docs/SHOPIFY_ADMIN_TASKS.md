# Shopify Admin Content Improvements

Complete these tasks in your Shopify Admin to finish the luxury brand transformation.

---

## 1. Clean Up Product Titles (High Priority)

**Problem:** Product titles like *"Artistic Abstract Sfumato Distressed Printed Merino Wool Waisted Polo Collar Long Sleeve Short Knit Sweater"* read like wholesale listings, not luxury retail.

**Solution:** Edit each product title to be editorial and concise (3-6 words max).

### How to Fix:
1. Go to **Shopify Admin → Products**
2. For each product, click to edit
3. Shorten the title to focus on the key selling point

### Examples:

| Current (Too Long) | Better (Luxury) |
|-------------------|----------------|
| "Artistic Abstract Sfumato Distressed Printed Merino Wool Waisted Polo Collar Long Sleeve Short Knit Sweater" | **"Sfumato Polo Knit"** or **"Abstract Merino Cardigan"** |
| "100% Cotton Relaxed Fit Wide Leg High Waist Palazzo Pants" | **"Cotton Palazzo Pants"** or **"Wide Leg Trousers"** |
| "Vintage Washed Denim Oversized Boyfriend Button Up Long Sleeve Jacket Coat" | **"Oversized Denim Jacket"** or **"Vintage Wash Coat"** |

### Bulk Edit Tip:
- Export products as CSV
- Edit `Title` column in Excel/Google Sheets
- Re-import (faster for 100+ products)

---

## 2. Standardize Vendor Names

**Problem:** Vendor names like `FIRELADY FUR` clash with VRAI's luxury aesthetic.

**Solution:** Use consistent, on-brand vendor names.

### How to Fix:
1. Go to **Shopify Admin → Products**
2. Filter by vendor
3. Edit each product or bulk edit via CSV export

### Recommendations:

| Current Vendor | Replace With |
|---------------|-------------|
| `FIRELADY FUR` | `VRAI` (if in-house) or `Firelady` (if partner brand) |
| Mixed case variations | Choose one format: `VRAI`, `Vrai`, or `V R A I` |
| Empty/blank | `VRAI` |

---

## 3. Clean Up Product Tags (Critical)

**Problem:** Tags expose raw data like model numbers (`14075C`, `14120LU`), material codes (`100% COTONE`), and price ranges (`$40-$80`).

**What Changed:** I added automatic tag filtering in the code to hide technical tags, but you should still clean them up in the admin for better organization.

### How to Fix:
1. Go to **Shopify Admin → Products → [Product]**
2. In the "Tags" field, remove:
   - Model numbers: `14075C`, `14286LU`, `15016CMM`
   - Material percentages: `100% COTONE`, `100% COTTON`, `100% LINO`
   - Just numbers: `10`, `12`, `14`
   - Price ranges: `$40-$80`, `$80-$160`
3. Keep only customer-facing tags like:
   - Style: `Minimal`, `Streetwear`, `Adventure`
   - Season: `Spring`, `Summer`, `Fall`, `Winter`
   - Feature: `Sale`, `New Arrival`, `Limited Edition`

### Bulk Tag Cleanup:
```
1. Export products as CSV
2. Open in Excel/Google Sheets
3. Find/Replace in "Tags" column:
   - Delete all number-only tags
   - Delete price range tags
   - Delete material codes
4. Re-import
```

---

## 4. Upload Logo & Favicon

**Problem:** The homepage uses a text wordmark "VRAI". Collection/product pages use the default Shopify header with no logo.

**What Changed:** I added logo support to the homepage template. It will automatically use your logo if you upload one.

### How to Upload:

#### Logo (appears on homepage)
1. Go to **Shopify Admin → Online Store → Themes**
2. Click **Customize** on your active theme
3. In the left sidebar, look for **Theme settings → Logo** (or in the homepage section settings)
4. Upload your logo image (SVG, PNG, or JPG)
   - **Recommended size:** 600px wide × transparent background
   - **Format:** SVG preferred (scales perfectly)

#### Favicon (browser tab icon)
1. Go to **Shopify Admin → Online Store → Themes → Customize**
2. Click **Theme settings** in the left sidebar
3. Scroll to **Favicon**
4. Upload a square image (PNG or ICO)
   - **Required size:** 32×32px or 64×64px
   - **Format:** PNG with transparent background

---

## 5. Add Collection Images (Optional but Recommended)

**Problem:** Collection cards on the homepage fallback to product images or Unsplash placeholders.

**What Changed:** I updated the code to use `collection.image` first, then fallback to the first product image.

### How to Add:
1. Go to **Shopify Admin → Products → Collections**
2. Click on a collection (e.g., "Minimal", "Streetwear", "Adventure")
3. Scroll to **Collection image**
4. Upload a hero image that represents the collection's mood
   - **Recommended size:** 1600px wide
   - **Aspect ratio:** Slightly portrait (3:4 or 4:5 works well)

---

## 6. Replace Placeholder Product Descriptions (Low Priority)

Many products may have generic or missing descriptions. For a luxury feel:

### How to Write Luxury Descriptions:
1. Go to **Shopify Admin → Products → [Product]**
2. Edit the **Description** field
3. Write 2-3 short paragraphs:
   - **Paragraph 1:** What makes it special (material, craftsmanship, design)
   - **Paragraph 2:** How to style it (versatility, occasions)
   - **Paragraph 3:** Fit and care notes

### Example:
```
Crafted from Italian merino wool with a vintage-inspired sfumato 
print, this polo knit balances artistry with wearability. The 
waisted silhouette flatters while the relaxed sleeves maintain ease.

Layer over high-waisted trousers for refined everyday dressing, or 
tuck into a pleated midi skirt for evening. Pairs naturally with 
neutral tailoring and minimal accessories.

True to size with a fitted waist and relaxed shoulders. Dry clean 
only to preserve the print saturation.
```

---

## Priority Order

Complete these tasks in this order for maximum impact:

1. ✅ **Product titles** (most visible, easiest to fix)
2. ✅ **Vendor names** (consistency throughout the site)
3. ✅ **Logo & favicon** (brand identity)
4. ⏱️ **Product tags** (optional now with auto-filtering, but good to clean)
5. ⏱️ **Collection images** (nice to have, fallbacks work)
6. ⏱️ **Product descriptions** (long-term content improvement)

---

## Need Help?

If you have 100+ products and need bulk editing assistance, consider:
- Shopify's **Bulk Editor** (Admin → Products → select multiple → Actions → Edit)
- CSV export/import for mass updates
- Shopify apps like **Bulk Product Edit** or **Mixtable**

---

*Last updated: March 24, 2026*
