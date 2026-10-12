from django.db import migrations


MENU = [
    ("Burger", "Delicious Burge", 15, "items/f2.png"),
    ("Burger", "Tasty Burger", 12, "items/f7.png"),
    ("Burger", "Big Burger", 20, "items/f8.png"),
    ("Pizza", "Delicious Pizza", 20, "items/f1.png"),
    ("Pizza", "Cheese Pizza", 25, "items/f3.png"),
    ("Pizza", "Veg Loaded Pizza", 30, "items/f6.png"),
    ("Pizza", "veggies with cheeze", 45, "items/o2.jpg"),
    ("Pasta", "Delicious Pasta", 13, "items/f4.png"),
    ("Pasta", "White Sause Pasta", 20, "items/f9.png"),
    ("Fries", "French Fries", 10, "items/f5.png"),
]
DESCRIPTION = (
    "Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, "
    "magnam voluptatem repellendus sed eaque"
)


def seed_menu(apps, schema_editor):
    ItemList = apps.get_model("Base_App", "ItemList")
    Items = apps.get_model("Base_App", "Items")
    db = schema_editor.connection.alias

    categories = {}
    for category_name, _, _, _ in MENU:
        if category_name not in categories:
            category, _ = ItemList.objects.using(db).get_or_create(
                Category_name=category_name
            )
            categories[category_name] = category

    for category_name, item_name, price, image in MENU:
        Items.objects.using(db).get_or_create(
            Item_name=item_name,
            defaults={
                "description": DESCRIPTION,
                "Price": price,
                "Category": categories[category_name],
                "Image": image,
            },
        )


class Migration(migrations.Migration):
    dependencies = [("Base_App", "0012_cart")]

    operations = [migrations.RunPython(seed_menu, migrations.RunPython.noop)]
