"use client"
import React, { useState } from 'react'
import PaymentTable from '../Table/PaymentTable'
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Payments() {

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
        <div className="">
        {/* Search and Sort */}
        <div className="flex flex-col justify-between w-full sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-65">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className=" max-w-65">
            <Select defaultValue="newest">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </div>
      </div>
      <div className="">

        <PaymentTable />
      </div>
    </div>
  )
}
