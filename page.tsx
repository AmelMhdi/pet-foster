"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, User, Clock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

interface FormData {
  email: string,
  phone_number: string,
  street_number: string,
  city: string,
  postal_code: string,
  country: string,
  commercial_name: string,
  siret: string,
  category_id: string,
  description: string,
  first_name: string,
  last_name: string,
  password: string,
  confirmPassword: string,
  acceptTerms: boolean,
}

export default function PartnerSignUpForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone_number: "",
    street_number: "",
    city: "",
    postal_code: "",
    country: "",
    commercial_name: "",  
    siret: "",
    category_id: "",
    description: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  })

  const businessTypes = [
    "Restaurant",
    "Café / Bar",
    "Boulangerie / Pâtisserie",
    "Boutique de mode",
    "Coiffeur / Barbier",
    "Institut de beauté",
    "Salle de sport",
    "Spa / Bien-être",
    "Garage automobile",
    "Magasin alimentaire",
    "Pharmacie",
    "Librairie",
    "Bijouterie",
    "Optique",
    "Autre",
  ]

  const cities = [
    "Saint-Denis",
    "Saint-Paul",
    "Saint-Pierre",
    "Le Tampon",
    "Saint-Louis",
    "Saint-André",
    "Saint-Joseph",
    "Le Port",
    "Saint-Leu",
    "Sainte-Marie",
    "Sainte-Suzanne",
    "Saint-Gilles",
    "L'Étang-Salé",
    "Les Avirons",
    "Petite-Île",
    "Saint-Philippe",
    "Sainte-Rose",
    "Bras-Panon",
    "Entre-Deux",
    "La Plaine-des-Palmistes",
    "Cilaos",
    "Salazie",
    "Trois-Bassins",
    "Les Trois-Bassins",
  ]

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const updateHours = (day: keyof FormData["hours"], field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value,
        },
      },
    }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = "Le nom du commerce est requis"
      if (!formData.businessType) newErrors.businessType = "Le type de commerce est requis"
      if (!formData.siret.trim()) newErrors.siret = "Le numéro SIRET est requis"
      if (!formData.address.trim()) newErrors.address = "L'adresse est requise"
      if (!formData.city) newErrors.city = "La ville est requise"
      if (!formData.postalCode.trim()) newErrors.postalCode = "Le code postal est requis"
      if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis"
      if (!formData.email.trim()) newErrors.email = "L'email est requis"
      if (!formData.description.trim()) newErrors.description = "La description est requise"
    }

    if (step === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis"
      if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis"
      if (!formData.position.trim()) newErrors.position = "La fonction est requise"
      if (!formData.contactPhone.trim()) newErrors.contactPhone = "Le téléphone est requis"
      if (!formData.contactEmail.trim()) newErrors.contactEmail = "L'email est requis"
    }

    if (step === 4) {
      if (!formData.password) newErrors.password = "Le mot de passe est requis"
      if (formData.password.length < 8) newErrors.password = "Le mot de passe doit contenir au moins 8 caractères"
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
      if (!formData.acceptTerms) newErrors.acceptTerms = "Vous devez accepter les conditions d'utilisation"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(4)) return

    setIsSubmitting(true)

    try {
      // Simulation d'envoi des données
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirection vers une page de succès
      window.location.href = "/auth/sign-up/success?type=partner"
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      setErrors({ submit: "Une erreur est survenue. Veuillez réessayer." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: "Informations du commerce", icon: <Store className="w-5 h-5" /> },
    { number: 2, title: "Responsable", icon: <User className="w-5 h-5" /> },
    { number: 3, title: "Horaires", icon: <Clock className="w-5 h-5" /> },
    { number: 4, title: "Finalisation", icon: <CheckCircle className="w-5 h-5" /> },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Indicateur d'étapes */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  currentStep >= step.number
                    ? "bg-brand-blue border-brand-blue text-white"
                    : "border-border text-muted-foreground"
                }`}
              >
                {step.icon}
              </div>
              <div className="ml-3 hidden md:block">
                <p
                  className={`text-sm font-medium ${currentStep >= step.number ? "text-brand-blue" : "text-muted-foreground"}`}
                >
                  Étape {step.number}
                </p>
                <p className="text-xs text-muted-foreground">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? "bg-brand-blue" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Étape 1: Informations du commerce */}
        {currentStep === 1 && (
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-brand-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Informations du commerce</h2>
                <p className="text-muted-foreground">Présentez votre établissement</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom du commerce *</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateFormData("businessName", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.businessName ? "border-red-500" : "border-border"
                  } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                  placeholder="Ex: Restaurant Le Gourmet"
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.businessName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Type de commerce *</label>
                <Select value={formData.businessType} onValueChange={(value) => updateFormData("businessType", value)}>
                  <SelectTrigger className={`${errors.businessType ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Sélectionnez votre activité" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.businessType && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.businessType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Numéro SIRET *</label>
                <input
                  type="text"
                  value={formData.siret}
                  onChange={(e) => updateFormData("siret", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.siret ? "border-red-500" : "border-border"
                  } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                  placeholder="14 chiffres"
                />
                {errors.siret && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.siret}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ville *</label>
                <Select value={formData.city} onValueChange={(value) => updateFormData("city", value)}>
                  <SelectTrigger className={`${errors.city ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Sélectionnez votre ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Adresse complète *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.address ? "border-red-500" : "border-border"
                  } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                  placeholder="15 Rue de la République"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Code postal *</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => updateFormData("postalCode", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.postalCode ? "border-red-500" : "border-border"
                  } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                  placeholder="97400"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.postalCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Téléphone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.phone ? "border-red-500" : "border-border"
                  } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                  placeholder="0262 XX XX XX"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email professionnel *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-border"
                  } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                  placeholder="contact@moncommerce.re"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Site web (optionnel)</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateFormData("website", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  placeholder="https://www.moncommerce.re"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description de votre commerce *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.description ? "border-red-500" : "border-border"
                  } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none`}
                  placeholder="Décrivez votre commerce, votre spécialité, votre ambiance..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Étape 2: Informations du responsable */}
        {currentStep === 2 && (
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-brand-green" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Responsable du compte</h2>
                <p className="text-muted-foreground">Qui sera votre contact principal ?</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Prénom *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.firstName ? "border-red-500" : "border-border"
                  } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                  placeholder="Jean"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.lastName ? "border-red-500" : "border-border"
                  } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                  placeholder="Dupont"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fonction *</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => updateFormData("position", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.position ? "border-red-500" : "border-border"
                  } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                  placeholder="Gérant, Propriétaire, Manager..."
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.position}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Téléphone personnel *</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData("contactPhone", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.contactPhone ? "border-red-500" : "border-border"
                  } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                  placeholder="0692 XX XX XX"
                />
                {errors.contactPhone && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.contactPhone}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Email personnel *</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData("contactEmail", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.contactEmail ? "border-red-500" : "border-border"
                  } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                  placeholder="jean.dupont@email.com"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.contactEmail}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Étape 3: Horaires */}
        {currentStep === 3 && (
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-yellow/10 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-brand-yellow" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Horaires d'ouverture</h2>
                <p className="text-muted-foreground">Définissez vos horaires d'ouverture</p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(formData.hours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border">
                  <div className="w-24">
                    <span className="font-medium text-foreground">{dayNames[day as keyof typeof dayNames]}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hours.closed}
                      onChange={(e) => updateHours(day as keyof FormData["hours"], "closed", e.target.checked)}
                      className="w-4 h-4 text-brand-blue bg-background border-border rounded focus:ring-brand-blue focus:ring-2"
                    />
                    <span className="text-sm text-muted-foreground">Fermé</span>
                  </div>

                  {!hours.closed && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateHours(day as keyof FormData["hours"], "open", e.target.value)}
                        className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      />
                      <span className="text-muted-foreground">à</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateHours(day as keyof FormData["hours"], "close", e.target.value)}
                        className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Information importante</p>
                  <p>
                    Vous pourrez modifier vos horaires à tout moment depuis votre espace partenaire. Ces informations
                    seront visibles par vos clients sur l'application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Étape 4: Finalisation */}
        {currentStep === 4 && (
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Finalisation</h2>
                <p className="text-muted-foreground">Créez votre mot de passe et validez votre inscription</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Mot de passe *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.password ? "border-red-500" : "border-border"
                      } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                      placeholder="Minimum 8 caractères"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirmer le mot de passe *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.confirmPassword ? "border-red-500" : "border-border"
                      } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent`}
                      placeholder="Confirmez votre mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={(e) => updateFormData("acceptTerms", e.target.checked)}
                    className="w-4 h-4 text-brand-blue bg-background border-border rounded focus:ring-brand-blue focus:ring-2 mt-1"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-foreground">
                    J'accepte les{" "}
                    <a
                      href="/conditions-generales"
                      className="text-brand-blue hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      conditions générales d'utilisation
                    </a>{" "}
                    et la{" "}
                    <a
                      href="/politique-confidentialite"
                      className="text-brand-blue hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      politique de confidentialité
                    </a>{" "}
                    de 97Pass *
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.acceptTerms}
                  </p>
                )}

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptMarketing"
                    checked={formData.acceptMarketing}
                    onChange={(e) => updateFormData("acceptMarketing", e.target.checked)}
                    className="w-4 h-4 text-brand-blue bg-background border-border rounded focus:ring-brand-blue focus:ring-2 mt-1"
                  />
                  <label htmlFor="acceptMarketing" className="text-sm text-foreground">
                    J'accepte de recevoir des informations commerciales et des conseils de 97Pass par email
                  </label>
                </div>
              </div>

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.submit}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <div>
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} className="gap-2 bg-transparent">
                Précédent
              </Button>
            )}
          </div>

          <div className="flex gap-4">
            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-brand-blue hover:bg-brand-blue/90 text-white gap-2"
              >
                Suivant
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-yellow hover:bg-brand-yellow/90 text-brand-navy font-semibold gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-brand-navy border-t-transparent rounded-full animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Finaliser l'inscription
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
