import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export default function Component() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [cart, setCart] = useState({ items: [], total: 0, tax: 0 })
  const [selectedContainer, setSelectedContainer] = useState(null)
  const [selectedSides, setSelectedSides] = useState([])
  const [selectedEntrees, setSelectedEntrees] = useState([])
  const [quantities, setQuantities] = useState({})
  const [notification, setNotification] = useState(null)

  const categories = ['Mains', 'Appetizers', 'Drinks', 'Extras']
  const containers = [
    { name: 'Bowl', sides: 1, entrees: 1 },
    { name: 'Plate', sides: 1, entrees: 2 },
    { name: 'Bigger Plate', sides: 1, entrees: 3 },
  ]
  const sides = ['Side 1', 'Side 2', 'Side 3', 'Side 4']
  const entrees = ['Entree 1', 'Entree 2', 'Entree 3', 'Entree 4', 'Entree 5']
  const items = {
    Appetizers: [
      { name: 'Appetizer 1', price: 5.99 },
      { name: 'Appetizer 2', price: 6.99 },
      { name: 'Appetizer 3', price: 7.99 },
    ],
    Drinks: [
      { name: 'Drink 1', price: 2.99 },
      { name: 'Drink 2', price: 3.99 },
      { name: 'Drink 3', price: 4.99 },
    ],
    Extras: [
      { name: 'Extra 1', price: 1.99 },
      { name: 'Extra 2', price: 2.99 },
      { name: 'Extra 3', price: 3.99 },
    ],
  }

  const addToCart = (items) => {
    setCart(prevCart => {
      const newItems = Array.isArray(items) ? items : [items]
      const newTotal = prevCart.total + newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return {
        items: [...prevCart.items, ...newItems],
        total: newTotal,
        tax: newTotal * 0.1
      }
    })
    setNotification("Item added to cart!")
    setTimeout(() => setNotification(null), 2000)
  }

  const removeFromCart = (index) => {
    setCart(prevCart => {
      const newItems = [...prevCart.items]
      const removedItem = newItems.splice(index, 1)[0]
      const newTotal = prevCart.total - removedItem.price * (removedItem.quantity || 1)
      return {
        items: newItems,
        total: newTotal,
        tax: newTotal * 0.1
      }
    })
  }

  const addMainsToCart = () => {
    if (selectedContainer && selectedSides.length === 1 && selectedEntrees.length === containers.find(c => c.name === selectedContainer).entrees) {
      const mainItem = {
        name: `${selectedContainer} Meal`,
        details: `Side: ${selectedSides[0]}, Entrees: ${selectedEntrees.join(', ')}`,
        price: 10.99,
        quantity: 1
      }
      addToCart(mainItem)
      setSelectedContainer(null)
      setSelectedSides([])
      setSelectedEntrees([])
    }
  }

  const handleQuantityChange = (itemName, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemName]: Math.max((prev[itemName] || 0) + change, 0)
    }))
  }

  const addItemsToCart = () => {
    const itemsToAdd = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemName, quantity]) => {
        const item = items[selectedCategory].find(i => i.name === itemName)
        return { ...item, quantity }
      })
    addToCart(itemsToAdd)
    setQuantities({})
  }

  useEffect(() => {
    if (selectedCategory !== 'Mains') {
      setQuantities({})
    }
  }, [selectedCategory])

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">{selectedCategory || 'Select a category'}</h2>
        {selectedCategory === 'Mains' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-4">
              {containers.map(container => (
                <Card 
                  key={container.name} 
                  className={`cursor-pointer ${selectedContainer === container.name ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedContainer(container.name)}
                >
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{container.name}</h3>
                    <p>{container.sides} Side, {container.entrees} Entree{container.entrees > 1 ? 's' : ''}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className={selectedContainer ? '' : 'opacity-50 pointer-events-none'}>
              <h3 className="text-xl font-semibold mb-4">Select Side (1)</h3>
              <div className="grid grid-cols-2 gap-4">
                {sides.map(side => (
                  <Card 
                    key={side} 
                    className={`cursor-pointer ${selectedSides.includes(side) ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedSides([side])}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{side}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className={selectedContainer ? '' : 'opacity-50 pointer-events-none'}>
              <h3 className="text-xl font-semibold mb-4">Select Entrees ({containers.find(c => c.name === selectedContainer)?.entrees || 0})</h3>
              <div className="grid grid-cols-3 gap-4">
                {entrees.map(entree => (
                  <Card 
                    key={entree} 
                    className={`cursor-pointer ${selectedEntrees.includes(entree) ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => {
                      const maxEntrees = containers.find(c => c.name === selectedContainer)?.entrees || 0
                      setSelectedEntrees(prev => 
                        prev.includes(entree) 
                          ? prev.filter(e => e !== entree)
                          : prev.length < maxEntrees ? [...prev, entree] : prev
                      )
                    }}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{entree}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={addMainsToCart} disabled={!selectedContainer || selectedSides.length !== 1 || selectedEntrees.length !== containers.find(c => c.name === selectedContainer)?.entrees}>
                Add to Cart
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              {selectedCategory && items[selectedCategory]?.map((item) => (
                <Card key={item.name} className="flex flex-col justify-between">
                  <CardContent className="p-4">
                    <h3 className="font-bold">{item.name}</h3>
                    <p>${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.name, -1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{quantities[item.name] || 0}</span>
                      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.name, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={addItemsToCart}>Add to Cart</Button>
            </div>
          </>
        )}
      </div>

      {/* Right Sidebar - Cart */}
      <div className="w-64 bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Cart</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Edit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Cart</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[50vh]">
                {cart.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <span>{item.name} (x{item.quantity})</span>
                    <Button variant="destructive" size="icon" onClick={() => removeFromCart(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {cart.items.map((item, index) => (
            <div key={index} className="mb-2">
              <span>{item.name} (x{item.quantity})</span>
              {item.details && <p className="text-sm text-gray-600">{item.details}</p>}
              <span className="float-right">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax:</span>
            <span>${cart.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold mb-4">
            <span>Total:</span>
            <span>${(cart.total + cart.tax).toFixed(2)}</span>
          </div>
          <Button className="w-full">Checkout</Button>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}