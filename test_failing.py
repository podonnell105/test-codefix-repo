def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5  # This passes
    assert add(5, 3) == 2  # This FAILS - should be 8
    assert add(0, 0) == 0  # This passesffffff
    