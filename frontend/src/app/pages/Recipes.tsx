import { useState, useEffect } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Search, ChefHat, Plus, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Recipes() {
  const { recipes, meals, addMeal, addRecipe } = useHealth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ingredients: [''],
    instructions: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    tags: ''
  });

  useEffect(() => {
    // Load recipes from backend if available
    fetch('/api/recipes')
      .then(res => res.json())
      .then(data => {
        // In real app, update recipes state
        console.log('Recipes loaded:', data);
      })
      .catch(() => {});
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.instructions) {
      toast.error('Please fill in name and instructions');
      return;
    }

    const newRecipe = {
      id: Date.now().toString(),
      name: formData.name,
      ingredients: formData.ingredients.filter(ing => ing.trim()),
      instructions: formData.instructions,
      calories: formData.calories,
      protein: formData.protein,
      carbs: formData.carbs,
      fats: formData.fats,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    addRecipe(newRecipe);
    toast.success('Recipe added successfully');
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      ingredients: [''],
      instructions: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      tags: ''
    });
    setShowForm(false);
  };

  const addRecipeToMeal = (recipe: any) => {
    addMeal({
      id: Date.now().toString(),
      name: recipe.name,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fats: recipe.fats,
      time: new Date().toTimeString().split(' ')[0],
      date: new Date().toISOString().split('T')[0]
    });
    toast.success('Recipe added to today\'s meals');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Recipes</h1>
          <p className="text-muted-foreground">Discover and create healthy recipes</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Recipe
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Recipe Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Ingredients</Label>
                {formData.ingredients.map((ingredient, index) => (
                  <Input
                    key={index}
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    className="mb-2"
                  />
                ))}
                <Button type="button" variant="outline" onClick={handleAddIngredient}>
                  Add Ingredient
                </Button>
              </div>
              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData(prev => ({ ...prev, calories: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData(prev => ({ ...prev, protein: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => setFormData(prev => ({ ...prev, carbs: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    value={formData.fats}
                    onChange={(e) => setFormData(prev => ({ ...prev, fats: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., healthy, vegan, quick"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recipe
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                {recipe.name}
              </CardTitle>
              <div className="flex flex-wrap gap-1">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Calories:</strong> {recipe.calories}</p>
                <p><strong>Protein:</strong> {recipe.protein}g | <strong>Carbs:</strong> {recipe.carbs}g | <strong>Fats:</strong> {recipe.fats}g</p>
                <div>
                  <strong>Ingredients:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {recipe.ingredients.slice(0, 3).map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                    {recipe.ingredients.length > 3 && <li>...and {recipe.ingredients.length - 3} more</li>}
                  </ul>
                </div>
              </div>
              <Button
                onClick={() => addRecipeToMeal(recipe)}
                className="w-full mt-4"
                variant="outline"
              >
                Add to Today's Meals
              </Button>
            </CardContent>
          </Card>
        ))}
        {filteredRecipes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recipes found</p>
          </div>
        )}
      </div>
    </div>
  );
}