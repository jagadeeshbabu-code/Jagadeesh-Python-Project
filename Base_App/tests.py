import json

from django.contrib.auth.models import AnonymousUser
from django.contrib.sessions.middleware import SessionMiddleware
from django.test import RequestFactory, TestCase

from Base_App.models import ItemList, Items
from Base_App.views import add_to_cart


class CartTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.category = ItemList.objects.create(Category_name='Burger')
        self.item = Items.objects.create(
            Item_name='Classic Burger',
            description='Tasty burger',
            Price=15,
            Category=self.category,
            Image='items/test.jpg',
        )

    def test_add_to_cart_for_anonymous_user(self):
        request = self.factory.post('/add-to-cart/', {'item_id': self.item.id})
        request.user = AnonymousUser()
        middleware = SessionMiddleware(lambda req: None)
        middleware.process_request(request)
        request.session.save()

        response = add_to_cart(request)

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['message'], 'Item added to cart')
        self.assertEqual(request.session['cart'][str(self.item.id)]['quantity'], 1)
