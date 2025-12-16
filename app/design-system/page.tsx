"use client"

import { useState } from "react"
import { MithoNavbar, MithoTabBar, MithoBreadcrumbs } from "@/components/ui/mitho-navigation"
import { MithoButton } from "@/components/ui/mitho-button"
import { MithoInput, MithoSearchInput } from "@/components/ui/mitho-input"
import {
  MithoSelect,
  MithoSelectTrigger,
  MithoSelectValue,
  MithoSelectContent,
  MithoSelectItem,
} from "@/components/ui/mitho-select"
import { MithoBadge, OpenNowBadge, ClosedBadge, TopRatedBadge, TrendingBadge } from "@/components/ui/mitho-badge"
import { StarRating, ReviewSummary } from "@/components/ui/mitho-rating"
import {
  RestaurantCard,
  FoodTruckCard,
  ReviewCard,
  UserProfileCard,
  TextCard,
  IconCard,
  ImageCard,
} from "@/components/ui/mitho-card"
import { MithoList, RestaurantListItem, FoodTruckListItem, SavedPlaceListItem } from "@/components/ui/mitho-list"
import { MithoToggle } from "@/components/ui/mitho-toggle"
import { MithoRadioGroup, MithoRadioGroupItem } from "@/components/ui/mitho-radio"
import { MithoCheckbox } from "@/components/ui/mitho-checkbox"
import { MithoAlert, MithoAlertTitle, MithoAlertDescription } from "@/components/ui/mitho-alert"
import { MithoToastProvider, useToast } from "@/components/ui/mitho-toast"
import { Search, Heart, Plus, Settings, ChevronRight, Star, Utensils, MapPin } from "lucide-react"

function ToastDemo() {
  const { addToast } = useToast()

  return (
    <div className="flex flex-wrap gap-3">
      <MithoButton
        variant="primary"
        size="sm"
        onClick={() =>
          addToast({
            variant: "success",
            title: "Restaurant Saved",
            description: "Luigi's Trattoria has been added to your favorites.",
          })
        }
      >
        Success Toast
      </MithoButton>
      <MithoButton
        variant="outline-info"
        size="sm"
        onClick={() =>
          addToast({
            variant: "info",
            title: "New Feature",
            description: "You can now filter by dietary restrictions!",
          })
        }
      >
        Info Toast
      </MithoButton>
      <MithoButton
        variant="outline-danger"
        size="sm"
        onClick={() =>
          addToast({
            variant: "danger",
            title: "Error",
            description: "Failed to save restaurant. Please try again.",
          })
        }
      >
        Error Toast
      </MithoButton>
      <MithoButton
        variant="ghost"
        size="sm"
        onClick={() =>
          addToast({
            variant: "warning",
            title: "Warning",
            description: "This restaurant closes in 30 minutes.",
          })
        }
      >
        Warning Toast
      </MithoButton>
    </div>
  )
}

function DesignSystemContent() {
  const [rating, setRating] = useState(3)
  const [inputValue, setInputValue] = useState("")
  const [toggleOn, setToggleOn] = useState(false)
  const [radioValue, setRadioValue] = useState("delivery")
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [alertDismissed, setAlertDismissed] = useState(false)

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <MithoNavbar />

      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-4xl md:text-6xl font-bold text-brand-dark-green mb-4">Mitho Cha!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Design System & UI Component Library for the ultimate food discovery platform
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <MithoButton size="lg">Explore Restaurants</MithoButton>
            <MithoButton variant="secondary" size="lg">
              Find Food Trucks
            </MithoButton>
          </div>
        </section>

        {/* Colors Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Brand Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              {
                name: "Orange (Primary)",
                color: "#EF8A00",
                class: "bg-brand-orange",
              },
              {
                name: "Deep Green",
                color: "#007936",
                class: "bg-brand-deep-green",
              },
              {
                name: "Light Green",
                color: "#8CAC1C",
                class: "bg-brand-light-green",
              },
              {
                name: "Dark Green",
                color: "#0A4635",
                class: "bg-brand-dark-green",
              },
              {
                name: "Fresh Orange",
                color: "#F19D4B",
                class: "bg-brand-fresh-orange",
              },
              {
                name: "Soft Beige",
                color: "#F4E0A6",
                class: "bg-brand-soft-beige",
              },
              { name: "White", color: "#FFFFFF", class: "bg-white border" },
            ].map((item) => (
              <div key={item.name} className="text-center">
                <div className={`h-20 rounded-xl ${item.class} shadow-sm`} />
                <p className="text-sm font-medium mt-2">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.color}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4">System Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Success", color: "#16A34A", class: "bg-success" },
              { name: "Info", color: "#3B82F6", class: "bg-info" },
              { name: "Warning", color: "#FACC15", class: "bg-warning" },
              { name: "Danger", color: "#DC2626", class: "bg-danger" },
            ].map((item) => (
              <div key={item.name} className="text-center">
                <div className={`h-16 rounded-xl ${item.class}`} />
                <p className="text-sm font-medium mt-2">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.color}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons Section - Enhanced */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Buttons</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Solid Variants</h3>
              <div className="flex flex-wrap gap-4">
                <MithoButton variant="primary">Primary</MithoButton>
                <MithoButton variant="secondary">Secondary</MithoButton>
                <MithoButton variant="success">Success</MithoButton>
                <MithoButton variant="danger">Danger</MithoButton>
                <MithoButton variant="ghost">Ghost</MithoButton>
                <MithoButton variant="link">Link</MithoButton>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Outline Variants</h3>
              <div className="flex flex-wrap gap-4">
                <MithoButton variant="outline-primary">Outline Primary</MithoButton>
                <MithoButton variant="outline-success">Outline Success</MithoButton>
                <MithoButton variant="outline-danger">Outline Danger</MithoButton>
                <MithoButton variant="outline-info">Outline Info</MithoButton>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">With Icons</h3>
              <div className="flex flex-wrap items-center gap-4">
                <MithoButton leftIcon={<Search />}>Search</MithoButton>
                <MithoButton variant="secondary" rightIcon={<ChevronRight />}>
                  Next
                </MithoButton>
                <MithoButton variant="success" leftIcon={<Heart />}>
                  Save
                </MithoButton>
                <MithoButton variant="outline-primary" leftIcon={<Plus />} rightIcon={<Star />}>
                  Add to Favorites
                </MithoButton>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Icon Only</h3>
              <div className="flex flex-wrap items-center gap-4">
                <MithoButton size="icon-sm" variant="primary">
                  <Plus />
                </MithoButton>
                <MithoButton size="icon" variant="secondary">
                  <Heart />
                </MithoButton>
                <MithoButton size="icon-lg" variant="ghost">
                  <Settings />
                </MithoButton>
                <MithoButton size="icon" variant="outline-primary">
                  <Search />
                </MithoButton>
                <MithoButton size="icon" variant="danger">
                  <Heart />
                </MithoButton>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <MithoButton size="sm">Small</MithoButton>
                <MithoButton size="default">Default</MithoButton>
                <MithoButton size="lg">Large</MithoButton>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">States</h3>
              <div className="flex flex-wrap gap-4">
                <MithoButton disabled>Disabled</MithoButton>
                <MithoButton loading>Loading</MithoButton>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Toggle / Switch</h2>
          <div className="space-y-6 max-w-md">
            <div>
              <h3 className="text-lg font-medium mb-3">Variants</h3>
              <div className="flex flex-wrap items-center gap-6">
                <MithoToggle checked={toggleOn} onCheckedChange={setToggleOn} />
                <MithoToggle variant="success" defaultChecked />
                <MithoToggle variant="secondary" defaultChecked />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-6">
                <MithoToggle size="sm" defaultChecked />
                <MithoToggle size="default" defaultChecked />
                <MithoToggle size="lg" defaultChecked />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">With Label</h3>
              <div className="space-y-4">
                <MithoToggle
                  label="Enable notifications"
                  description="Receive alerts about new restaurants"
                  defaultChecked
                />
                <MithoToggle label="Dark mode" description="Switch to dark theme" variant="secondary" />
                <MithoToggle label="Disabled toggle" disabled />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Radio Buttons</h2>
          <div className="space-y-6 max-w-md">
            <div>
              <h3 className="text-lg font-medium mb-3">Variants & Sizes</h3>
              <div className="flex flex-wrap items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Default:</span>
                  <MithoRadioGroup defaultValue="a">
                    <MithoRadioGroupItem value="a" />
                  </MithoRadioGroup>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Success:</span>
                  <MithoRadioGroup defaultValue="b">
                    <MithoRadioGroupItem value="b" variant="success" />
                  </MithoRadioGroup>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Secondary:</span>
                  <MithoRadioGroup defaultValue="c">
                    <MithoRadioGroupItem value="c" variant="secondary" />
                  </MithoRadioGroup>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <MithoRadioGroup defaultValue="sm">
                  <MithoRadioGroupItem value="sm" size="sm" label="Small" />
                </MithoRadioGroup>
                <MithoRadioGroup defaultValue="md">
                  <MithoRadioGroupItem value="md" size="default" label="Default" />
                </MithoRadioGroup>
                <MithoRadioGroup defaultValue="lg">
                  <MithoRadioGroupItem value="lg" size="lg" label="Large" />
                </MithoRadioGroup>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Radio Group</h3>
              <MithoRadioGroup label="Order Type" value={radioValue} onValueChange={setRadioValue}>
                <MithoRadioGroupItem value="delivery" label="Delivery" description="Get food delivered to your door" />
                <MithoRadioGroupItem value="pickup" label="Pickup" description="Pick up your order at the restaurant" />
                <MithoRadioGroupItem value="dine-in" label="Dine-in" description="Eat at the restaurant" />
              </MithoRadioGroup>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Checkboxes</h2>
          <div className="space-y-6 max-w-md">
            <div>
              <h3 className="text-lg font-medium mb-3">Variants</h3>
              <div className="flex flex-wrap items-center gap-6">
                <MithoCheckbox defaultChecked />
                <MithoCheckbox variant="success" defaultChecked />
                <MithoCheckbox variant="secondary" defaultChecked />
                <MithoCheckbox variant="danger" defaultChecked />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-6">
                <MithoCheckbox size="sm" defaultChecked label="Small" />
                <MithoCheckbox size="default" defaultChecked label="Default" />
                <MithoCheckbox size="lg" defaultChecked label="Large" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">States</h3>
              <div className="space-y-3">
                <MithoCheckbox
                  checked={checkboxChecked}
                  onCheckedChange={(checked) => setCheckboxChecked(checked as boolean)}
                  label="Unchecked / Checked"
                />
                <MithoCheckbox indeterminate label="Indeterminate" />
                <MithoCheckbox disabled label="Disabled" />
                <MithoCheckbox disabled defaultChecked label="Disabled checked" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">With Description</h3>
              <div className="space-y-3">
                <MithoCheckbox
                  label="Vegetarian only"
                  description="Show only vegetarian-friendly restaurants"
                  defaultChecked
                />
                <MithoCheckbox label="Open now" description="Filter to restaurants currently open" variant="success" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Alerts</h2>
          <div className="space-y-4 max-w-2xl">
            <MithoAlert variant="default">
              <MithoAlertTitle>Default Alert</MithoAlertTitle>
              <MithoAlertDescription>This is a default alert for general information.</MithoAlertDescription>
            </MithoAlert>

            <MithoAlert variant="success">
              <MithoAlertTitle>Success!</MithoAlertTitle>
              <MithoAlertDescription>
                Your reservation has been confirmed at Luigi&apos;s Trattoria.
              </MithoAlertDescription>
            </MithoAlert>

            <MithoAlert variant="info">
              <MithoAlertTitle>Did you know?</MithoAlertTitle>
              <MithoAlertDescription>
                You can filter restaurants by dietary restrictions using the new filter menu.
              </MithoAlertDescription>
            </MithoAlert>

            <MithoAlert variant="warning">
              <MithoAlertTitle>Restaurant closing soon</MithoAlertTitle>
              <MithoAlertDescription>
                This restaurant closes in 30 minutes. Place your order quickly!
              </MithoAlertDescription>
            </MithoAlert>

            <MithoAlert variant="danger">
              <MithoAlertTitle>Payment failed</MithoAlertTitle>
              <MithoAlertDescription>
                We couldn&apos;t process your payment. Please try again or use a different payment method.
              </MithoAlertDescription>
            </MithoAlert>

            <MithoAlert variant="outline">
              <MithoAlertTitle>Outline Alert</MithoAlertTitle>
              <MithoAlertDescription>A subtle alert style with outline border.</MithoAlertDescription>
            </MithoAlert>

            {!alertDismissed && (
              <MithoAlert variant="info" dismissible onDismiss={() => setAlertDismissed(true)}>
                <MithoAlertTitle>Dismissible Alert</MithoAlertTitle>
                <MithoAlertDescription>Click the X button to dismiss this alert.</MithoAlertDescription>
              </MithoAlert>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Toast Notifications</h2>
          <p className="text-muted-foreground mb-4">
            Click the buttons below to trigger different toast notifications.
          </p>
          <ToastDemo />
        </section>

        {/* Inputs Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Inputs</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
            <MithoInput
              label="Text Field"
              placeholder="Enter your name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <MithoInput label="With Error" placeholder="Enter email" error="Please enter a valid email address" />
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">Search Bar</label>
              <MithoSearchInput />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Dropdown Filter</label>
              <MithoSelect>
                <MithoSelectTrigger>
                  <MithoSelectValue placeholder="Select cuisine" />
                </MithoSelectTrigger>
                <MithoSelectContent>
                  <MithoSelectItem value="italian">Italian</MithoSelectItem>
                  <MithoSelectItem value="mexican">Mexican</MithoSelectItem>
                  <MithoSelectItem value="japanese">Japanese</MithoSelectItem>
                  <MithoSelectItem value="indian">Indian</MithoSelectItem>
                </MithoSelectContent>
              </MithoSelect>
            </div>
          </div>
        </section>

        {/* Ratings Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Ratings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Star Rating Display</h3>
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Small</p>
                  <StarRating rating={4.5} size="sm" showValue />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Medium</p>
                  <StarRating rating={4.5} size="md" showValue />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Large</p>
                  <StarRating rating={4.5} size="lg" showValue />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Interactive Rating Input</h3>
              <StarRating rating={rating} size="lg" interactive onChange={setRating} showValue />
            </div>
            <div className="max-w-lg">
              <h3 className="text-lg font-medium mb-3">Review Summary</h3>
              <ReviewSummary ratings={{ 5: 234, 4: 123, 3: 45, 2: 12, 1: 5 }} averageRating={4.3} totalReviews={419} />
            </div>
          </div>
        </section>

        {/* Badges Section - Enhanced */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Badges & Tags</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Solid Variants</h3>
              <div className="flex flex-wrap gap-3">
                <OpenNowBadge />
                <TopRatedBadge />
                <TrendingBadge />
                <ClosedBadge />
                <MithoBadge variant="info">New</MithoBadge>
                <MithoBadge variant="muted">Popular</MithoBadge>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Outline Variants</h3>
              <div className="flex flex-wrap gap-3">
                <MithoBadge variant="outline">Verified</MithoBadge>
                <MithoBadge variant="outline-orange">Featured</MithoBadge>
                <MithoBadge variant="outline-success">Available</MithoBadge>
                <MithoBadge variant="outline-danger">Sold Out</MithoBadge>
                <MithoBadge variant="outline-info">Coming Soon</MithoBadge>
                <MithoBadge variant="outline-warning">Limited</MithoBadge>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <MithoBadge size="sm">Small</MithoBadge>
                <MithoBadge size="default">Default</MithoBadge>
                <MithoBadge size="lg">Large</MithoBadge>
              </div>
            </div>
          </div>
        </section>

        {/* Breadcrumbs Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Breadcrumbs</h2>
          <MithoBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Restaurants", href: "/restaurants" },
              { label: "Italian", href: "/restaurants/italian" },
              { label: "Luigi's Trattoria" },
            ]}
          />
        </section>

        {/* Cards Section - Enhanced */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Cards</h2>

          <h3 className="text-lg font-medium mb-4">Simple Cards</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <TextCard
              title="Text Card"
              description="A simple card with just a title and description. Perfect for content blocks, FAQs, or feature explanations."
            />
            <IconCard
              icon={<Utensils className="h-6 w-6" />}
              title="Icon Card"
              description="Cards with icons are great for features, services, or category selections."
            />
            <IconCard
              icon={<MapPin className="h-6 w-6" />}
              title="Location Services"
              description="Find restaurants near you with our location-based search."
              iconBgColor="bg-brand-deep-green/10"
            />
          </div>

          <h3 className="text-lg font-medium mb-4">Image Cards</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ImageCard
              imageUrl="/italian-pasta-dish.png"
              imageAlt="Italian pasta"
              title="Italian Cuisine"
              description="Discover authentic Italian restaurants serving handmade pasta, wood-fired pizzas, and traditional dishes."
            />
            <ImageCard
              imageUrl="/mexican-tacos.jpg"
              imageAlt="Mexican tacos"
              title="Mexican Food"
              description="From street tacos to gourmet burritos, explore the best Mexican eateries in your area."
              aspectRatio="square"
            />
            <ImageCard
              imageUrl="/sushi-platter.png"
              imageAlt="Sushi platter"
              title="Japanese Dining"
              description="Experience the art of Japanese cuisine with fresh sushi, ramen, and izakaya favorites."
              aspectRatio="wide"
            />
          </div>

          <h3 className="text-lg font-medium mb-4">Restaurant Cards</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <RestaurantCard
              name="Luigi's Trattoria"
              cuisine="Italian · Pizza · Pasta"
              rating={4.7}
              reviewCount={342}
              priceRange="$$"
              location="Downtown"
              distance="0.5 mi"
              imageUrl="/italian-restaurant-interior.png"
              isOpen={true}
              isTopRated={true}
            />
            <RestaurantCard
              name="Sakura Sushi Bar"
              cuisine="Japanese · Sushi · Ramen"
              rating={4.5}
              reviewCount={189}
              priceRange="$$$"
              location="Midtown"
              distance="1.2 mi"
              imageUrl="/japanese-sushi-restaurant.png"
              isOpen={true}
              isTrending={true}
            />
            <RestaurantCard
              name="El Mariachi"
              cuisine="Mexican · Tacos · Burritos"
              rating={4.3}
              reviewCount={256}
              priceRange="$"
              location="East Side"
              distance="0.8 mi"
              imageUrl="/colorful-mexican-restaurant.png"
              isOpen={false}
            />
          </div>

          <h3 className="text-lg font-medium mb-4">Food Truck Cards</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <FoodTruckCard
              name="Taco Loco"
              cuisine="Mexican Street Food"
              rating={4.8}
              reviewCount={156}
              location="City Park"
              schedule="Mon-Fri 11AM-3PM"
              imageUrl="/colorful-taco-food-truck.jpg"
              isOpen={true}
              isTrending={true}
            />
            <FoodTruckCard
              name="BBQ Boss"
              cuisine="American BBQ"
              rating={4.6}
              reviewCount={98}
              location="Main Street"
              schedule="Thu-Sun 5PM-10PM"
              imageUrl="/bbq-food-truck-smoking.jpg"
              isOpen={false}
            />
          </div>

          <h3 className="text-lg font-medium mb-4">Review Card</h3>
          <div className="max-w-xl">
            <ReviewCard
              author="Sarah M."
              authorImage="/woman-profile.png"
              rating={5}
              date="2 days ago"
              content="Absolutely amazing food! The pasta was cooked to perfection and the service was outstanding. Will definitely be coming back soon. Highly recommend the carbonara!"
              helpful={12}
            />
          </div>

          <h3 className="text-lg font-medium mt-8 mb-4">User Profile Card</h3>
          <div className="max-w-sm">
            <UserProfileCard
              name="John Foodie"
              avatar="/smiling-man-profile.png"
              reviewCount={47}
              savedPlaces={23}
              joinedDate="March 2024"
              bio="Food enthusiast exploring the best eats in the city!"
            />
          </div>
        </section>

        {/* Lists Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Lists</h2>

          <h3 className="text-lg font-medium mb-4">Restaurant List</h3>
          <MithoList className="max-w-2xl mb-8">
            <RestaurantListItem
              name="The Golden Fork"
              cuisine="American · Steakhouse"
              rating={4.6}
              reviewCount={278}
              priceRange="$$$"
              location="Financial District"
              distance="1.5 mi"
              imageUrl="/upscale-steakhouse.png"
              isOpen={true}
              isTopRated={true}
            />
            <RestaurantListItem
              name="Pho Paradise"
              cuisine="Vietnamese · Noodles"
              rating={4.4}
              reviewCount={167}
              priceRange="$"
              location="Chinatown"
              distance="0.7 mi"
              imageUrl="/vietnamese-pho-restaurant.png"
              isOpen={true}
              isTrending={true}
            />
          </MithoList>

          <h3 className="text-lg font-medium mb-4">Food Truck List</h3>
          <MithoList className="max-w-2xl mb-8">
            <FoodTruckListItem
              name="Waffle Wagon"
              cuisine="Belgian Waffles · Desserts"
              rating={4.9}
              reviewCount={89}
              location="University Campus"
              schedule="Daily 8AM-2PM"
              imageUrl="/waffle-food-truck.jpg"
              isOpen={true}
              isTrending={true}
            />
          </MithoList>

          <h3 className="text-lg font-medium mb-4">Saved Places</h3>
          <MithoList className="max-w-2xl">
            <SavedPlaceListItem
              name="Luigi's Trattoria"
              type="restaurant"
              cuisine="Italian"
              rating={4.7}
              imageUrl="/italian-restaurant-exterior.jpg"
              savedDate="Dec 5, 2024"
            />
            <SavedPlaceListItem
              name="Taco Loco"
              type="food-truck"
              cuisine="Mexican"
              rating={4.8}
              imageUrl="/vibrant-taco-truck.jpg"
              savedDate="Dec 3, 2024"
            />
          </MithoList>
        </section>

        {/* Typography Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Typography</h2>
          <div className="space-y-4 max-w-2xl">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Heading 1</p>
              <h1 className="text-4xl font-bold">Discover Amazing Food</h1>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Heading 2</p>
              <h2 className="text-3xl font-bold">Popular Restaurants</h2>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Heading 3</p>
              <h3 className="text-2xl font-bold">Top Rated in Your Area</h3>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Body Text (Poppins)</p>
              <p className="text-base leading-relaxed">
                Mitho Cha! helps you discover the best restaurants and food trucks in your city. From cozy Italian
                trattorias to trendy taco trucks, we&apos;ve got all your cravings covered.
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Small Text</p>
              <p className="text-sm text-muted-foreground">Last updated 2 hours ago · 342 reviews</p>
            </div>
          </div>
        </section>

        {/* Layout System */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Layout System</h2>
          <div className="space-y-4">
            <div className="p-4 bg-brand-soft-beige/50 rounded-xl">
              <h3 className="font-medium mb-2">8pt Spacing System</h3>
              <div className="flex items-end gap-2">
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                  <div key={n} className="text-center">
                    <div className="bg-brand-orange rounded" style={{ width: n * 4, height: n * 4 }} />
                    <span className="text-xs text-muted-foreground mt-1 block">{n * 4}px</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-brand-soft-beige/50 rounded-xl">
              <h3 className="font-medium mb-2">Border Radius</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-orange rounded-sm flex items-center justify-center text-white text-xs">
                  sm
                </div>
                <div className="w-16 h-16 bg-brand-orange rounded-md flex items-center justify-center text-white text-xs">
                  md
                </div>
                <div className="w-16 h-16 bg-brand-orange rounded-lg flex items-center justify-center text-white text-xs">
                  lg
                </div>
                <div className="w-16 h-16 bg-brand-orange rounded-xl flex items-center justify-center text-white text-xs">
                  xl
                </div>
                <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center text-white text-xs">
                  2xl
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MithoTabBar />
    </div>
  )
}

export default function DesignSystemPage() {
  return (
    <MithoToastProvider>
      <DesignSystemContent />
    </MithoToastProvider>
  )
}
