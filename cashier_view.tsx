import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function Component() {
  const [cart, setCart] = useState({ total: 0, tax: 0 })
  const [selectedSides, setSelectedSides] = useState([])

  const categories = ['Axfres', 'Drinks', 'Appetizers', 'Mains', 'Hoody']
  const sides = ['Side 1', 'Side 2', 'Side 3', 'Side 4', 'Side 5']

  const handleSideSelect = (side) => {
    setSelectedSides(prev => 
      prev.includes(side) 
        ? prev.filter(s => s !== side)
        : [...prev, side]
    )
  }

  const addToOrder = () => {
    // Implement order logic here
    setCart({ total: cart.total + 10, tax: (cart.total + 10) * 0.1 })
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-5 gap-4 mb-6">
        {categories.map(category => (
          <div key={category} className="border rounded p-2">
            <h2 className="font-bold mb-2">{category}</h2>
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="bg-gray-100 p-2 mb-2">Item {item}</div>
            ))}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-2">Sides select - max</h3>
        <div className="grid grid-cols-5 gap-2">
          {sides.map(side => (
            <label key={side} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedSides.includes(side)}
                onCheckedChange={() => handleSideSelect(side)}
              />
              <span>{side}</span>
            </label>
          ))}
        </div>
      </div>

      <Button onClick={addToOrder} className="w-full mb-4">Add to order</Button>

      <div className="border-t pt-4">
        <h3 className="font-bold mb-2">Cart</h3>
        <div className="flex justify-between mb-2">
          <span>Total:</span>
          <span>${cart.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Tax:</span>
          <span>${cart.tax.toFixed(2)}</span>
        </div>
        <Button className="w-full">Checkout ${(cart.total + cart.tax).toFixed(2)}</Button>
      </div>
    </div>
  )
}