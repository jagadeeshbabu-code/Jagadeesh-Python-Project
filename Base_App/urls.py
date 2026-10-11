from django.urls import path

from .views import (
    AboutView,
    BookTableView,
    FeedbackView,
    HomeView,
    ItemDetailView,
    MenuView,
    add_to_cart,
    get_cart_items,
    update_cart,
)

urlpatterns = [
    path('', HomeView, name='Home'),
    path('about/', AboutView, name='About'),
    path('menu/', MenuView, name='Menu'),
    path('menu/item/<int:item_id>/', ItemDetailView, name='Item_Detail'),
    path('book_table/', BookTableView, name='Book_Table'),
    path('feedback/', FeedbackView, name='Feedback_Form'),
    path('add-to-cart/', add_to_cart, name='add_to_cart'),
    path('get-cart-items/', get_cart_items, name='get_cart_items'),
    path('update-cart/', update_cart, name='update_cart'),
]
