const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "src/components/shop/ProductDetails.tsx",
  "src/app/shop/page.tsx",
  "src/app/product/[id]/page.tsx",
  "src/app/dashboard/products/page.tsx",
  "src/app/dashboard/page.tsx",
  "src/app/dashboard/orders/page.tsx",
  "src/app/checkout/page.tsx",
  "src/app/dashboard/orders/[id]/page.tsx"
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix `£{` back to `${`
    content = content.replace(/£\{/g, '${');
    
    // Fix string literal that had $ before ${ -> now £${
    // Actually, I want £${var} instead of $${var} or £{var}
    // So if there's $£{var}, I change it to £${var}
    content = content.replace(/\$£\{/g, '£${');
    content = content.replace(/`\£\$\{/g, '`£${');
    
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed ${file}`);
  }
});
