export function calculateNetPerHour(
  price,
  platformFeeValue, // Agar ye flat fee hai toh direct use hoga
  taxPercent,
  durationMinutes
) {
  // 🔒 Normalize inputs
  const basePrice = Number(price) || 0;
  const flatFee = Number(platformFeeValue) || 0;
  const taxRate = Number(taxPercent) || 0;
  const durationInHours = durationMinutes / 60;

  if (durationMinutes <= 0) return 0;

  // 1. Calculate Base Price for total duration
  // Agar 1000/hr hai aur 3 ghante hain toh 3000 ho jayega
  const totalBasePrice = basePrice * durationInHours;

  // 2. Calculate Tax on the total base price
  const totalTax = (totalBasePrice * taxRate) / 100;

  // 3. Final Total (Base + Tax + Flat Platform Fee)
  // Note: Platform fee usually flat hoti hai per booking, ya usey bhi multiply karna hai toh basePrice mein add karein
  const finalTotal = totalBasePrice + totalTax + flatFee;

  return Math.round(finalTotal);
}