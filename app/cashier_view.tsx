'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import Image from 'next/image'

export default function Component() {
  const [selectedCategory, setSelectedCategory] = useState('Mains')
  const [cart, setCart] = useState({ items: [], total: 0, tax: 0 })
  const [selectedContainer, setSelectedContainer] = useState(null)
  const [selectedSides, setSelectedSides] = useState([])
  const [selectedEntrees, setSelectedEntrees] = useState([])
  const [quantities, setQuantities] = useState({})
  const [notification, setNotification] = useState(null)

  const categories = ['Mains', 'Appetizers', 'Drinks', 'Extras']
  const containers = [
    { name: 'Bowl', sides: 1, entrees: 1, image: '/placeholder.svg?height=100&width=100' },
    { name: 'Plate', sides: 1, entrees: 2, image: '/placeholder.svg?height=100&width=100' },
    { name: 'Bigger Plate', sides: 1, entrees: 3, image: '/placeholder.svg?height=100&width=100' },
  ]
  const sides = [
    { name: 'White Rice', image: '/placeholder.svg?height=100&width=100' },
    { name: 'Fried Rice', image: '/placeholder.svg?height=100&width=100' },
    { name: 'Chow Mein', image: '/placeholder.svg?height=100&width=100' },
  ]
  const entrees = [
    { name: 'Orange Chicken', image: '/placeholder.svg?height=100&width=100' },
    { name: 'Beijing Beef', image: '/placeholder.svg?height=100&width=100' },
    { name: 'Broccoli Beef', image: '/placeholder.svg?height=100&width=100' },
    { name: 'String Bean Chicken Breast', image: '/placeholder.svg?height=100&width=100' },
    { name: 'Black Pepper Angus Steak', image: '/placeholder.svg?height=100&width=100' },
  ]
  const items = {
    Appetizers: [
      { name: 'Chicken Egg Roll', price: 1.95, image: '/placeholder.svg?height=100&width=100' },
      { name: 'Veggie Spring Roll', price: 1.95, image: '/placeholder.svg?height=100&width=100' },
    ],
    Drinks: [
      { name: 'Fountain Drink', price: 2.45, image: '/placeholder.svg?height=100&width=100' },
      { name: 'Bottled Water', price: 2.15, image: '/placeholder.svg?height=100&width=100' },
    ],
    Extras: [
      { name: 'Fortune Cookies', price: 0.95, image: '/placeholder.svg?height=100&width=100' },
      { name: 'Soy Sauce', price: 0.25, image: '/placeholder.svg?height=100&width=100' },
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
    <div className="flex h-screen bg-[#2C2C2C] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#D02B2E] p-4 flex justify-between items-center z-10">
        <div className="flex items-center">
          <Image src="/placeholder.svg?height=40&width=40" alt="Panda Express Logo" width={40} height={40} className="mr-2" />
          <h1 className="text-2xl font-bold">Panda Express</h1>
        </div>
        <Button variant="secondary">Log out</Button>
      </div>

      {/* Left Sidebar */}
      <div className="w-64 bg-[#D02B2E] p-4 pt-20">
        <h2 className="text-xl font-bold mb-4">Hello, Cashier</h2>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "ghost"}
              className={`w-full justify-start mb-2 text-white ${selectedCategory === category ? 'bg-[#FF9636] hover:bg-[#FFA54F]' : 'hover:bg-[#E03A3C]'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 pt-20 overflow-auto">
        <h2 className="text-3xl font-bold mb-4">{selectedCategory}</h2>
        {selectedCategory === 'Mains' ? (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Select Container</h3>
              <div className="grid grid-cols-3 gap-4">
                {containers.map(container => (
                  <Card 
                    key={container.name} 
                    className={`cursor-pointer bg-[#D02B2E] border-2 border-black ${selectedContainer === container.name ? 'ring-2 ring-[#FFD700]' : ''}`}
                    onClick={() => setSelectedContainer(container.name)}
                  >
                    <CardContent className="p-4 flex flex-col items-center">
                      <Image src={container.image} alt={container.name} width={100} height={100} className="mb-2" />
                      <h3 className="text-lg font-semibold text-white">{container.name}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className={selectedContainer ? '' : 'opacity-50 pointer-events-none'}>
              <h3 className="text-xl font-semibold mb-4">Select Side (1)</h3>
              <div className="grid grid-cols-3 gap-4">
                {sides.map(side => (
                  <Card 
                    key={side.name} 
                    className={`cursor-pointer bg-[#D02B2E] border-2 border-black ${selectedSides.includes(side.name) ? 'ring-2 ring-[#FFD700]' : ''}`}
                    onClick={() => setSelectedSides([side.name])}
                  >
                    <CardContent className="p-4 flex flex-col items-center">
                      <Image src={side.image} alt={side.name} width={100} height={100} className="mb-2" />
                      <h4 className="font-semibold text-white">{side.name}</h4>
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
                    key={entree.name} 
                    className={`cursor-pointer bg-[#D02B2E] border-2 border-black ${selectedEntrees.includes(entree.name) ? 'ring-2 ring-[#FFD700]' : ''}`}
                    onClick={() => {
                      const maxEntrees = containers.find(c => c.name === selectedContainer)?.entrees || 0
                      setSelectedEntrees(prev => 
                        prev.includes(entree.name) 
                          ? prev.filter(e => e !== entree.name)
                          : prev.length < maxEntrees ? [...prev, entree.name] : prev
                      )
                    }}
                  >
                    <CardContent className="p-4 flex flex-col items-center">
                      <Image src={entree.image} alt={entree.name} width={100} height={100} className="mb-2" />
                      <h4 className="font-semibold text-white">{entree.name}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={addMainsToCart} 
                disabled={!selectedContainer || selectedSides.length !== 1 || selectedEntrees.length !== containers.find(c => c.name === selectedContainer)?.entrees}
                className="bg-[#FF9636] hover:bg-[#FFA54F] text-white"
              >
                Add to order
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              {selectedCategory && items[selectedCategory]?.map((item) => (
                <Card key={item.name} className="flex flex-col justify-between bg-[#D02B2E] border-2 border-black">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Image src={item.image} alt={item.name} width={100} height={100} className="mb-2" />
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <p className="text-white">${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.name, -1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2 text-white">{quantities[item.name] || 0}</span>
                      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.name, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={addItemsToCart} className="bg-[#FF9636] hover:bg-[#FFA54F] text-white">Add to order</Button>
            </div>
          </>
        )}
      </div>

      {/* Right Sidebar - Cart */}
      <div className="w-64 bg-[#D02B2E] p-4 pt-20 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Cart</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">Edit</Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2C2C2C] text-white">
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
        <ScrollArea className="flex-grow mb-4">
          {cart.items.map((item, index) => (
            
            <div key={index} className="mb-2">
              <span>{item.name} (x{item.quantity})</span>
              {item.details && <p className="text-sm text-gray-300">{item.details}</p>}
              <span className="float-right">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </ScrollArea>
        <div>
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
          <Button className="w-full mb-2 bg-[#FF9636] hover:bg-[#FFA54F] text-white">Checkout</Button>
          <Button variant="secondary" className="w-full">Issue refund</Button>
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