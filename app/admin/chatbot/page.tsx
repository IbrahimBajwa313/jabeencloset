"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Save, X } from "lucide-react"
import { toast } from "sonner"

interface FAQ {
  _id?: string
  question: string
  answer: string
  category: string
  keywords: string[]
  language: string
  isActive: boolean
  priority: number
}

interface Knowledge {
  _id?: string
  title: string
  content: string
  type: "instruction" | "policy" | "guide" | "general"
  category: string
  keywords: string[]
  language: string
  isActive: boolean
  priority: number
}

export default function ChatbotManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [knowledge, setKnowledge] = useState<Knowledge[]>([])
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [editingKnowledge, setEditingKnowledge] = useState<Knowledge | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [newFaq, setNewFaq] = useState<FAQ>({
    question: "",
    answer: "",
    category: "",
    keywords: [],
    language: "en",
    isActive: true,
    priority: 0
  })

  const [newKnowledge, setNewKnowledge] = useState<Knowledge>({
    title: "",
    content: "",
    type: "general",
    category: "",
    keywords: [],
    language: "en",
    isActive: true,
    priority: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [faqRes, knowledgeRes] = await Promise.all([
        fetch("/api/admin/chatbot/faqs"),
        fetch("/api/admin/chatbot/knowledge")
      ])
      
      if (faqRes.ok) {
        const faqData = await faqRes.json()
        setFaqs(faqData)
      }
      
      if (knowledgeRes.ok) {
        const knowledgeData = await knowledgeRes.json()
        setKnowledge(knowledgeData)
      }
    } catch (error) {
      toast.error("Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }

  const saveFaq = async (faq: FAQ) => {
    try {
      const method = faq._id ? "PUT" : "POST"
      const url = faq._id ? `/api/admin/chatbot/faqs/${faq._id}` : "/api/admin/chatbot/faqs"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faq)
      })

      if (response.ok) {
        toast.success(faq._id ? "FAQ updated" : "FAQ created")
        fetchData()
        setEditingFaq(null)
        setNewFaq({
          question: "",
          answer: "",
          category: "",
          keywords: [],
          language: "en",
          isActive: true,
          priority: 0
        })
      }
    } catch (error) {
      toast.error("Failed to save FAQ")
    }
  }

  const saveKnowledge = async (knowledge: Knowledge) => {
    try {
      const method = knowledge._id ? "PUT" : "POST"
      const url = knowledge._id ? `/api/admin/chatbot/knowledge/${knowledge._id}` : "/api/admin/chatbot/knowledge"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(knowledge)
      })

      if (response.ok) {
        toast.success(knowledge._id ? "Knowledge updated" : "Knowledge created")
        fetchData()
        setEditingKnowledge(null)
        setNewKnowledge({
          title: "",
          content: "",
          type: "general",
          category: "",
          keywords: [],
          language: "en",
          isActive: true,
          priority: 0
        })
      }
    } catch (error) {
      toast.error("Failed to save knowledge")
    }
  }

  const deleteFaq = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/chatbot/faqs/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("FAQ deleted")
        fetchData()
      }
    } catch (error) {
      toast.error("Failed to delete FAQ")
    }
  }

  const deleteKnowledge = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/chatbot/knowledge/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Knowledge deleted")
        fetchData()
      }
    } catch (error) {
      toast.error("Failed to delete knowledge")
    }
  }

  const parseKeywords = (keywordString: string): string[] => {
    return keywordString.split(",").map(k => k.trim()).filter(k => k.length > 0)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Chatbot Knowledge Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage FAQs and knowledge base for your AI chatbot
        </p>
      </div>

      <Tabs defaultValue="faqs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="space-y-6">
          {/* Add New FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New FAQ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="faq-question">Question</Label>
                  <Input
                    id="faq-question"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    placeholder="Enter FAQ question"
                  />
                </div>
                <div>
                  <Label htmlFor="faq-category">Category</Label>
                  <Input
                    id="faq-category"
                    value={newFaq.category}
                    onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                    placeholder="e.g., Orders, Shipping, Returns"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="faq-answer">Answer</Label>
                <Textarea
                  id="faq-answer"
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  placeholder="Enter FAQ answer"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="faq-keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="faq-keywords"
                    value={newFaq.keywords.join(", ")}
                    onChange={(e) => setNewFaq({ ...newFaq, keywords: parseKeywords(e.target.value) })}
                    placeholder="order, shipping, delivery"
                  />
                </div>
                <div>
                  <Label htmlFor="faq-language">Language</Label>
                  <Select value={newFaq.language} onValueChange={(value) => setNewFaq({ ...newFaq, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="faq-priority">Priority</Label>
                  <Input
                    id="faq-priority"
                    type="number"
                    value={newFaq.priority}
                    onChange={(e) => setNewFaq({ ...newFaq, priority: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <Button onClick={() => saveFaq(newFaq)} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save FAQ
              </Button>
            </CardContent>
          </Card>

          {/* FAQ List */}
          <div className="grid gap-4">
            {faqs.map((faq) => (
              <Card key={faq._id}>
                <CardContent className="p-6">
                  {editingFaq?._id === faq._id ? (
                    <div className="space-y-4">
                      <Input
                        value={editingFaq.question}
                        onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      />
                      <Textarea
                        value={editingFaq.answer}
                        onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveFaq(editingFaq)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingFaq(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{faq.question}</h3>
                        <div className="flex gap-2">
                          <Badge variant={faq.isActive ? "default" : "secondary"}>
                            {faq.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => setEditingFaq(faq)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteFaq(faq._id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{faq.answer}</p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>Category: {faq.category}</span>
                        <span>•</span>
                        <span>Language: {faq.language}</span>
                        <span>•</span>
                        <span>Priority: {faq.priority}</span>
                      </div>
                      {faq.keywords.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {faq.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          {/* Add New Knowledge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Knowledge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="knowledge-title">Title</Label>
                  <Input
                    id="knowledge-title"
                    value={newKnowledge.title}
                    onChange={(e) => setNewKnowledge({ ...newKnowledge, title: e.target.value })}
                    placeholder="Enter knowledge title"
                  />
                </div>
                <div>
                  <Label htmlFor="knowledge-type">Type</Label>
                  <Select value={newKnowledge.type} onValueChange={(value: any) => setNewKnowledge({ ...newKnowledge, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instruction">Instruction</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="knowledge-content">Content</Label>
                <Textarea
                  id="knowledge-content"
                  value={newKnowledge.content}
                  onChange={(e) => setNewKnowledge({ ...newKnowledge, content: e.target.value })}
                  placeholder="Enter knowledge content"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="knowledge-category">Category</Label>
                  <Input
                    id="knowledge-category"
                    value={newKnowledge.category}
                    onChange={(e) => setNewKnowledge({ ...newKnowledge, category: e.target.value })}
                    placeholder="e.g., Policies, Instructions"
                  />
                </div>
                <div>
                  <Label htmlFor="knowledge-language">Language</Label>
                  <Select value={newKnowledge.language} onValueChange={(value) => setNewKnowledge({ ...newKnowledge, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="knowledge-priority">Priority</Label>
                  <Input
                    id="knowledge-priority"
                    type="number"
                    value={newKnowledge.priority}
                    onChange={(e) => setNewKnowledge({ ...newKnowledge, priority: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="knowledge-keywords">Keywords (comma-separated)</Label>
                <Input
                  id="knowledge-keywords"
                  value={newKnowledge.keywords.join(", ")}
                  onChange={(e) => setNewKnowledge({ ...newKnowledge, keywords: parseKeywords(e.target.value) })}
                  placeholder="policy, return, refund"
                />
              </div>

              <Button onClick={() => saveKnowledge(newKnowledge)} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Knowledge
              </Button>
            </CardContent>
          </Card>

          {/* Knowledge List */}
          <div className="grid gap-4">
            {knowledge.map((item) => (
              <Card key={item._id}>
                <CardContent className="p-6">
                  {editingKnowledge?._id === item._id ? (
                    <div className="space-y-4">
                      <Input
                        value={editingKnowledge.title}
                        onChange={(e) => setEditingKnowledge({ ...editingKnowledge, title: e.target.value })}
                      />
                      <Textarea
                        value={editingKnowledge.content}
                        onChange={(e) => setEditingKnowledge({ ...editingKnowledge, content: e.target.value })}
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveKnowledge(editingKnowledge)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingKnowledge(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <div className="flex gap-2">
                          <Badge variant="outline">{item.type}</Badge>
                          <Badge variant={item.isActive ? "default" : "secondary"}>
                            {item.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => setEditingKnowledge(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteKnowledge(item._id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2 line-clamp-3">{item.content}</p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>Category: {item.category}</span>
                        <span>•</span>
                        <span>Language: {item.language}</span>
                        <span>•</span>
                        <span>Priority: {item.priority}</span>
                      </div>
                      {item.keywords.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {item.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
