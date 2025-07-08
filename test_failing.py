def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5  # This passes
    assert add(5, 3) == 8  # This FAILS - should be 8
    assert add(5, 3) == 8  # Fixed: correct expected value
    
    
    # test fix 

    # TODO: Review the test cases for accuracy and clarity